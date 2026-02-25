"use server"
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { sendEmail } from "@/lib/mail";
import { format, startOfDay, endOfDay } from "date-fns";
import cron from "node-cron";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


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

  const session = await getServerSession(authOptions)
  const inputEmail = data.patientDetails.email;

  const loggedInUserEmail = session.user.email;

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
      patientEmail: inputEmail,
      userEmail: loggedInUserEmail,
    });
    await newAppointment.save();

    // Create dashboard notifications
    if (Notification) {
      await new Notification({
        userEmail: loggedInUserEmail,
        message: `${data.patientDetails.name} booked ${data.doctorName} at ${data.slot}`,
        type: "appointment",
        isRead: false,
      }).save();
    }

    // Sending email confirmation
    const emailBody = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #00AEEF;">
      
      <h2 style="color: #00AEEF; margin-top: 0; font-size: 24px;">Appointment Confirmed!</h2>
      
      <p style="font-size: 16px;">Dear <strong>${data.patientDetails.name}</strong>,</p>
      
      <p style="font-size: 16px;">We are pleased to confirm that your appointment has been successfully scheduled. Below are the details of your upcoming visit:</p>
      
      <div style="background-color: #f8fbfb; border: 1px solid #e1e8ed; padding: 20px; border-radius: 6px; margin: 25px 0;">
        <p style="margin: 0 0 12px 0; font-size: 16px;">
          <span style="color: #7f8c8d; display: inline-block; width: 70px;">Doctor:</span> 
          <strong>${data.doctorName}</strong>
        </p>
        <p style="margin: 0 0 12px 0; font-size: 16px;">
          <span style="color: #7f8c8d; display: inline-block; width: 70px;">Date:</span> 
          <strong>${format(new Date(data.date), 'PPP')}</strong>
        </p>
        <p style="margin: 0; font-size: 16px;">
          <span style="color: #7f8c8d; display: inline-block; width: 70px;">Time:</span> 
          <strong style="color: #00AEEF;">${data.slot}</strong>
        </p>
      </div>
      
      <p style="font-size: 14px; color: #555;">
        If you need to reschedule or cancel your appointment, please contact us as soon as possible. We look forward to seeing you!
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      
      <p style="margin-bottom: 0; font-size: 14px;">Thank you for choosing <strong>DocSchedule</strong>.</p>
      <p style="margin-top: 5px; font-size: 14px;">Warm regards,</p>
      
    </div>
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
 * 3. Reminder scheduling (1 hour in advance)
 */ 

function scheduleReminder(appointment) {
  // 1. Get the base date
  const appointmentTime = new Date(appointment.appointmentDate);

  // 2. Parse the timeSlot (e.g., "09:00 AM" or "02:30 PM")
  const [time, modifier] = appointment.timeSlot.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Convert 12-hour format to 24-hour format
  if (hours === 12) {
    hours = modifier === "AM" ? 0 : 12;
  } else if (modifier === "PM") {
    hours += 12;
  }

  // 3. Set the exact hours and minutes to the appointment Date
  appointmentTime.setHours(hours, minutes, 0, 0);

  // 4. Now subtract 1 hour (60 * 60 * 1000 milliseconds)
  const reminderTime = new Date(appointmentTime.getTime() - (60 * 60 * 1000));

  console.log(`[DEBUG] Appointment is at: ${appointmentTime}`);
  console.log(`[DEBUG] Reminder scheduled for: ${reminderTime}`);

  // Check if the reminder time has already passed
  if (reminderTime < new Date()) {
    console.log("Reminder time has already passed. Email will not be scheduled.");
    return;
  }

  // 5. Schedule the Cron Job
  const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;

  cron.schedule(cronTime, async () => {
    const reminderBody = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #00AEEF;">
      
      <h2 style="color: #2c3e50; margin-top: 0; font-size: 24px;">Appointment Reminder</h2>
      
      <p style="font-size: 16px;">Dear <strong>${appointment.patientName}</strong>,</p>
      
      <p style="font-size: 16px;">This is a friendly reminder that your consultation is coming up in just <strong>1 hour</strong>.</p>
      
      <div style="background-color: #f8fbfb; border: 1px solid #e1e8ed; padding: 20px; border-radius: 6px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-size: 16px;">
          <span style="color: #7f8c8d;">Doctor:</span> 
          <strong>${appointment.doctorName}</strong>
        </p>
        <p style="margin: 0; font-size: 16px;">
          <span style="color: #7f8c8d;">Time:</span> 
          <strong style="color: #00AEEF;">${appointment.timeSlot}</strong>
        </p>
      </div>
      
      <p style="font-size: 14px; color: #555;">
        Please plan to be available or arrive a few minutes early. If you have any urgent questions before your appointment, feel free to contact our support team.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      
      <p style="margin-bottom: 0; font-size: 14px;">Warm regards,</p>
      <p style="margin-top: 5px; font-size: 14px;"><strong>The DocSchedule Team</strong></p>
      
    </div>
  </div>
`;

    try {
      await sendEmail(appointment.patientEmail, "Appointment Reminder", reminderBody);
      console.log(`Reminder email successfully sent to ${appointment.patientEmail}`);
    } catch (error) {
      console.error("Failed to send reminder email:", error);
    }
  });
}


