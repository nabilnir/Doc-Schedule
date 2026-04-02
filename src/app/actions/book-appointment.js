"use server"

import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient"; // Patient Model Import
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
    // 1. Parse the date and time strings
    const appointmentDate = new Date(appointment.appointmentDate);
    const [time, modifier] = appointment.timeSlot.split(" ");
let [hours, minutes] = time.split(":").map(Number);

if (modifier === "PM" && hours !== 12) {
  hours += 12;
}
if (modifier === "AM" && hours === 12) {
  hours = 0;
}

const startTime = new Date(Date.UTC(
  appointmentDate.getFullYear(),
  appointmentDate.getMonth(),
  appointmentDate.getDate(),
  hours,
  minutes,
  0
));

    // 4. Set duration to exactly 30 minutes
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    // 5. Manual RFC3339 Formatting (Required for Google API Timezone accuracy)
    const formatForGoogle = (date) => {
      const pad = (n) => (n < 10 ? "0" + n : n);
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
    };

    const event = {
      summary: `Medical Appointment: ${appointment.doctorName}`,
      location: "Clinic / Hospital",
      description: `Patient: ${appointment.patientName}. Slot: ${appointment.timeSlot}.`,
      start: { 
        dateTime: formatForGoogle(startTime), 
        timeZone: "Asia/Dhaka" 
      },
      end: { 
        dateTime: formatForGoogle(endTime), 
        timeZone: "Asia/Dhaka" 
      },
      attendees: [{ email: appointment.patientEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 1440 },
          { method: "popup", minutes: 30 },
        ],
      },
    };

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    console.log(`LOG: Calendar Event Created for ${appointment.timeSlot} (30 mins)`);
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
    const dateStr = targetDate.toISOString().split('T')[0];

    // 1. Fetch booked appointments
    const appointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
      status: { $ne: 'cancelled' } 
    }).select('timeSlot');
    
    const booked = appointments.map(app => app.timeSlot);

    // 2. Fetch doctor's blocked slots/dates
    const doctor = await Doctor.findById(doctorId).select('blockedSlots time_slots');
    if (doctor && doctor.blockedSlots) {
      const block = doctor.blockedSlots.find(b => b.date === dateStr);
      if (block) {
        // If slots are empty, it means the whole day is blocked
        if (!block.slots || block.slots.length === 0) {
          return doctor.time_slots || []; // Return all slots as booked
        } else {
          // Add specifically blocked slots
          block.slots.forEach(s => {
            if (!booked.includes(s)) booked.push(s);
          });
        }
      }
    }

    return booked;
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
        type: "booking", 
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

    // 1. Check if slot is already taken
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

    // 2. Check if slot or entire date is blocked by doctor (Availability Check)
    const doctor = await Doctor.findById(data.doctorId).select('blockedSlots');
    if (doctor && doctor.blockedSlots) {
        const dateStr = new Date(data.date).toISOString().split('T')[0];
        const block = doctor.blockedSlots.find(b => b.date === dateStr);
        if (block) {
            if (!block.slots || block.slots.length === 0 || block.slots.includes(data.slot)) {
                return { success: false, error: "The doctor is unavailable on this date/time." };
            }
        }
    }

    // 3. Save the Appointment
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

    // --- ADDED: Patient Record Logic (Upsert) ---
    // Ensure patient exists or update their last visit info
    await Patient.findOneAndUpdate(
      { email: inputEmail }, 
      { 
        $set: {
          name: data.patientDetails.name,
          age: data.patientDetails.age,
          gender: data.patientDetails.gender,
          email: inputEmail || loggedInUserEmail,
          lastVisit: new Date(),
          doctorId: data.doctorId,
        },
        $inc: { totalVisits: 1 }
      },
      { upsert: true, new: true, runValidators: true } 
    );

    // 4. Notification
    if (Notification) {
      await new Notification({
        userEmail: loggedInUserEmail,
        name: data.patientDetails.name,
        doctorName: data.doctorName,
        timeSlot: data.slot,
        message: `Booking initiated for ${data.doctorName}. Awaiting payment.`,
        type: "appointment",
        status: "confirmed",
        
        isRead: false,
      }).save();
    }

    return { 
      success: true, 
      appointmentId: savedApp._id.toString() 
    };

  } catch (error) {
    console.error("LOG: Fatal Booking Error:", error);
    return { success: false, error: error.message || "An internal server error occurred." };
  }
}