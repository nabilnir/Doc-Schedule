"use server"

import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import SystemLog from "@/models/SystemLog";
import { sendEmail } from "@/lib/mail";
import { format, startOfDay, endOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { google } from "googleapis";
import Notification from "@/models/Notification";

// --- Google Calendar Configuration ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

/**
 * Helper: Adds the appointment to Google Calendar.
 */
async function addToGoogleCalendar(appointment) {
  try {
    const appointmentDate = new Date(appointment.appointmentDate);
    const [time, modifier] = appointment.timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (hours === 12) {
      hours = modifier === "AM" ? 0 : 12;
    } else if (modifier === "PM") {
      hours += 12;
    }

    const startTime = new Date(appointmentDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Medical Appointment: ${appointment.doctorName}`,
      location: "Clinic / Hospital",
      description: `Patient: ${appointment.patientName}, Age: ${appointment.patientAge}. Booked via DocSchedule.`,
      start: { dateTime: startTime.toISOString(), timeZone: "Asia/Dhaka" },
      end: { dateTime: endTime.toISOString(), timeZone: "Asia/Dhaka" },
      attendees: [{ email: appointment.patientEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 1440 },
          { method: "popup", minutes: 60 },
        ],
      },
    };

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    console.log("LOG: Google Calendar Event Created");
    return true;
  } catch (error) {
    console.error("LOG: Google Calendar API Error:", error.message);
    return false;
  }
}

// --- Server Actions ---

/**
 * Fetches already booked slots for a specific doctor on a specific date.
 */
export async function getBookedSlots(doctorId, date) {
  try {
    await connectDB();
    const targetDate = new Date(date);
    const appointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: { $ne: 'cancelled' } 
    }).select('timeSlot');
    return appointments.map(app => app.timeSlot);
  } catch (error) {
    console.error("LOG: Error fetching booked slots:", error);
    return [];
  }
}

/**
 * Handles confirmation logic after successful payment.
 */
export async function handleConfirmedAppointment(appointmentId) {
  try {
    await connectDB();

    // 1. Update the database record
    const updatedApp = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status: "confirmed", 
        paymentStatus: "paid" 
      },
      { new: true }
    );

    if (!updatedApp) {
      return { success: false, error: "Appointment not found." };
    }

    // 2. Sync with Google Calendar
    await addToGoogleCalendar(updatedApp);

    // 3. Send final confirmation email
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Payment Received & Confirmed!</h2>
        <p>Hello <strong>${updatedApp.patientName}</strong>,</p>
        <p>Your payment was successful. Your appointment is now officially confirmed.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>Doctor:</strong> ${updatedApp.doctorName}</p>
          <p><strong>Date:</strong> ${format(new Date(updatedApp.appointmentDate), 'PPPP')}</p>
          <p><strong>Time:</strong> ${updatedApp.timeSlot}</p>
          <p><strong>Payment Status:</strong> Paid</p>
        </div>
      </div>
    `;

    await sendEmail(updatedApp.patientEmail, "Payment Successful - DocSchedule", emailBody);

    // 4. Log the success (FIXED Validation Error by using 'booking' instead of 'payment')
    const session = await getServerSession(authOptions);
    try {
      await SystemLog.create({
        type: "booking", // Use 'booking' as 'payment' is not in your model enum
        status: "success",
        message: `Appointment ${appointmentId} updated to PAID status.`,
        userEmail: session?.user?.email || "system",
      });
    } catch (logErr) {
      console.warn("LOG: SystemLog validation failed, but appointment update continues.");
    }

    return { success: true };
  } catch (error) {
    console.error("LOG: Confirmation Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Main action to initiate a booking.
 */
export async function bookAppointment(data) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, error: "Unauthorized access. Please log in." };
  }

  const inputEmail = data.patientDetails.email;
  const loggedInUserEmail = session.user.email;

  try {
    await connectDB();

    const existing = await Appointment.findOne({
      doctorId: data.doctorId,
      appointmentDate: { 
        $gte: startOfDay(new Date(data.date)), 
        $lte: endOfDay(new Date(data.date)) 
      },
      timeSlot: data.slot,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return { success: false, error: "This time slot is already taken." };
    }

    const newApp = new Appointment({
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      appointmentDate: data.date,
      timeSlot: data.slot,
      patientName: data.patientDetails.name,
      patientAge: data.patientDetails.age,
      patientGender: data.patientDetails.gender,
      patientBloodGroup: data.patientDetails.bloodGroup,
      patientEmail: inputEmail,
      userEmail: loggedInUserEmail,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    const savedApp = await newApp.save();

    if (Notification) {
      await new Notification({
        userEmail: loggedInUserEmail,
        message: `Booking initiated for ${data.doctorName}. Awaiting payment.`,
        type: "appointment",
        isRead: false,
      }).save();
    }

    return { 
      success: true, 
      appointmentId: savedApp._id.toString() 
    };

    console.log(`LOG: Sending Nodemailer confirmation to ${data.patientDetails.email}`);
    await sendEmail(data.patientDetails.email, "Appointment Confirmed - DocSchedule", emailBody);

    // Return the ID so the UI can redirect to Stripe Checkout
    return { success: true, appointmentId: savedApp._id.toString() };
  } catch (error) {
    console.error("LOG: Fatal Booking Error:", error);
    return { success: false, error: error.message || "An internal server error occurred." };
  }
}