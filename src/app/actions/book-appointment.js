"use server"

import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { sendEmail } from "@/lib/mail";
import { format, startOfDay, endOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { google } from "googleapis";

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
 * Helper: Adds the appointment to Google Calendar and sends an email invitation.
 */
async function addToGoogleCalendar(appointment) {
  try {
    // 1. Parse time slot (e.g., "10:00 AM") to set Date object hours
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
    
    // Set appointment duration to 1 hour
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 

    const event = {
      summary: `Medical Appointment: ${appointment.doctorName}`,
      location: "Clinic / Hospital",
      description: `Patient: ${appointment.patientName}, Age: ${appointment.patientAge}. Booked via DocSchedule.`,
      start: { 
        dateTime: startTime.toISOString(), 
        timeZone: "Asia/Dhaka" 
      },
      end: { 
        dateTime: endTime.toISOString(), 
        timeZone: "Asia/Dhaka" 
      },
      // Adding the patient as an attendee triggers the invitation email
      attendees: [
        { email: appointment.patientEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 1440 }, // 24 hours before
          { method: "popup", minutes: 60 },   // 1 hour before
        ],
      },
    };

    // 2. Insert event to Google Calendar
    // sendUpdates: "all" is critical for the guest to receive the email
    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all", 
    });

    console.log("LOG: Google Calendar Event Created & Invitation Sent");
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
      appointmentDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) }
    }).select('timeSlot');
    return appointments.map(app => app.timeSlot);
  } catch (error) {
    console.error("LOG: Error fetching booked slots:", error);
    return [];
  }
}

/**
 * Main action to book an appointment, save to DB, and sync with Calendar/Email.
 */
export async function bookAppointment(data) {
  const session = await getServerSession(authOptions);
  
  // Check if user is logged in
  if (!session) return { success: false, error: "Unauthorized access." };

  try {
    console.log("LOG: Initializing booking process...");
    await connectDB();

    // 1. Check for duplicate bookings in the same slot
    const existing = await Appointment.findOne({
      doctorId: data.doctorId,
      appointmentDate: { $gte: startOfDay(new Date(data.date)), $lte: endOfDay(new Date(data.date)) },
      timeSlot: data.slot
    });

    if (existing) return { success: false, error: "This time slot is already taken." };

    // 2. Save appointment details to MongoDB
    const newApp = new Appointment({
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      appointmentDate: data.date,
      timeSlot: data.slot,
      patientName: data.patientDetails.name,
      patientAge: data.patientDetails.age,
      patientBloodGroup: data.patientDetails.bloodGroup,
      patientEmail: data.patientDetails.email,
      userEmail: session.user.email,
    });
    
    const savedApp = await newApp.save();
    console.log("LOG: Appointment record saved to database.");

    // 3. Sync with Google Calendar (Sends the auto-invite)
    await addToGoogleCalendar(savedApp);

    // 4. Send a custom confirmation email via Nodemailer
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
        <p>Hello <strong>${data.patientDetails.name}</strong>,</p>
        <p>Your appointment has been successfully scheduled.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${format(new Date(data.date), 'PPPP')}</p>
          <p><strong>Time:</strong> ${data.slot}</p>
        </div>
        <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
          * A Google Calendar invitation has also been sent to your email.
        </p>
      </div>
    `;

    console.log(`LOG: Sending Nodemailer confirmation to ${data.patientDetails.email}`);
    await sendEmail(data.patientDetails.email, "Appointment Confirmed - DocSchedule", emailBody);
    
    return { success: true };
  } catch (error) {
    console.error("LOG: Fatal Booking Error:", error);
    return { success: false, error: error.message || "An internal server error occurred." };
  }
}