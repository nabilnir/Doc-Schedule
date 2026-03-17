import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { parse, set, isValid } from "date-fns";

export async function POST(req) {
    try {
        await connectDB();
        const { appointmentId } = await req.json();

        // 1. Appointment check
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Jodi agei cancel hoye thake
        if (appointment.status === 'cancelled') {
            return NextResponse.json({ error: "Appointment is already cancelled" }, { status: 400 });
        }

        // 2. Precise Time Logic (Combining Date & TimeSlot)
        const baseDate = new Date(appointment.appointmentDate);
        const timeStr = appointment.timeSlot; // e.g., "02:20 AM"
        
        // "hh:mm a" format e parse kora
        const parsedTime = parse(timeStr, 'hh:mm a', new Date());

        // Full DateTime object toiri
        const fullAppointmentDateTime = set(baseDate, {
            hours: parsedTime.getHours(),
            minutes: parsedTime.getMinutes(),
            seconds: 0,
            milliseconds: 0
        });

        const now = new Date();
        const diffInMs = fullAppointmentDateTime.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        // 3. ২ ঘণ্টার validation check
        if (diffInHours < 2) {
            return NextResponse.json({ 
                error: "Cancellation not allowed. Minimum 2 hours notice required." 
            }, { status: 400 });
        }

        // 4. Google Calendar theke remove
        if (appointment.googleEventId) {
            try {
                const auth = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET
                );
                auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
                const calendar = google.calendar({ version: 'v3', auth });
                
                await calendar.events.delete({
                    calendarId: 'primary',
                    eventId: appointment.googleEventId,
                });
            } catch (err) {
                console.error("Google Calendar Error:", err.message);
                // Calendar error holeo amra process thamabo na
            }
        }

        // 5. Email Logic
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { 
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        await transporter.sendMail({
            from: `"Doctor Care Support" <${process.env.EMAIL_USER}>`,
            to: appointment.patientEmail,
            subject: "Your Appointment Has Been Cancelled",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    <h2 style="color: #d32f2f;">Appointment Cancellation</h2>
                    <p>Dear <b>${appointment.patientName}</b>,</p>
                    <p>We are confirming that your appointment with <b>Dr. ${appointment.doctorName}</b> has been successfully cancelled.</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><b>Appointment Details:</b></p>
                        <p style="margin: 5px 0;">Date: ${baseDate.toDateString()}</p>
                        <p style="margin: 5px 0;">Time: ${appointment.timeSlot}</p>
                    </div>
                    <p>If you did not request this, please contact our support team immediately.</p>
                    <p>Best Regards,<br>Doctor Care Team</p>
                </div>
            `
        });

        // 6. Database Update
        appointment.status = 'cancelled';
        await appointment.save();

        return NextResponse.json({ message: "Appointment cancelled and email sent." });

    } catch (error) {
        console.error("Cancellation API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}