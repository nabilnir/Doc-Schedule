"use server"
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { sendEmail } from "@/lib/mail";
import { format, startOfDay, endOfDay } from "date-fns";
import cron from "node-cron";
import Notification from "@/models/Notification";

export async function getBookedSlots(doctorId, date) {
  try {
    await connectDB();
    const targetDate = new Date(date);
    
    // Find all appointments on a specific day
    const appointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      }
    }).select('timeSlot');

    return appointments.map(app => app.timeSlot);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
}

export async function bookAppointment(data) {
  try {
    await connectDB();

    // Check for duplicate bookings at the same time 
    const existingAppointment = await Appointment.findOne({
      doctorId: data.doctorId,
      appointmentDate: {
        $gte: startOfDay(new Date(data.date)),
        $lte: endOfDay(new Date(data.date))
      },
      timeSlot: data.slot
    });

    if (existingAppointment) {
      return { success: false, error: "This slot has already been booked." };
    }
    
    // Save new appointment
    const newAppointment = new Appointment({
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      appointmentDate: data.date,
      timeSlot: data.slot,
      patientName: data.patientDetails.name,
      patientAge: data.patientDetails.age,
      patientBloodGroup: data.patientDetails.bloodGroup,
      patientEmail: data.patientDetails.email, 
    });
    await newAppointment.save();

  // Create dashboard notifications
    if (Notification) {
      await new Notification({
        message: `${data.patientDetails.name} booked ${data.doctorName} at ${data.slot}`,
      }).save();
    }

    // Sending email confirmation
    const emailBody = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #00AEEF;">Appointment Confirmed!</h1>
        <p>Hello <strong>${data.patientDetails.name}</strong>,</p>
        <p>Your appointment with <strong>${data.doctorName}</strong> has been booked successfully.</p>
        <hr />
        <p><strong>Date:</strong> ${format(new Date(data.date), 'PPP')}</p>
        <p><strong>Time:</strong> ${data.slot}</p>
        <br/>
        <p>Thank you for choosing <strong>TicketBari</strong>.</p>
      </div>
    `;
    await sendEmail(data.patientDetails.email, "Appointment Confirmation", emailBody);

    // Scheduling reminders
    scheduleReminder(newAppointment);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


/**
 * ৩. Reminder scheduling (1 hour in advance)
 */
function scheduleReminder(appointment) {
  const appointmentTime = new Date(appointment.appointmentDate);
  // Note: Here you can add logic to extract the exact time from your time slot (eg: 09:00 AM)
// Currently it is set to 1 hour before the appointment date
  const reminderTime = new Date(appointmentTime.getTime() - (60 * 60 * 1000));

  // Currently will not schedule if time has passed
  if (reminderTime < new Date()) return;

  const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;

  cron.schedule(cronTime, async () => {
    const reminderBody = `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2>Appointment Reminder</h2>
        <p>Hi ${appointment.patientName}, just a reminder that your appointment with <strong>${appointment.doctorName}</strong> is in 1 hour at <strong>${appointment.timeSlot}</strong>.</p>
        <p>See you soon!</p>
      </div>
    `;
    await sendEmail(appointment.patientEmail, "Appointment Reminder", reminderBody);
  });
}