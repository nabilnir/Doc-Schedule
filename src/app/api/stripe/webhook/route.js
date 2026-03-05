import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { handleConfirmedAppointment } from "@/app/actions/book-appointment";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Check if it's an appointment booking
    if (session.metadata?.appointmentId) {
      const appointmentId = session.metadata.appointmentId;

      try {
        await connectDB();

        // 1️⃣ Update appointment status → confirmed
        const updatedApp = await Appointment.findByIdAndUpdate(
          appointmentId,
          { status: "confirmed", paymentStatus: "paid" },
          { new: true }
        );

        console.log(`Webhook: Appointment ${appointmentId} confirmed and paid`);

        // 2️⃣ Trigger integrations (Google Calendar & Email)
        if (updatedApp) {
          await handleConfirmedAppointment(appointmentId);
        }
      } catch (error) {
        console.error("Webhook processing error for appointment:", error);
      }
    }
    // Check if it's a doctor subscription
    else if (session.metadata?.isSubscription === "true") {
      const userId = session.metadata.userId;
      const planType = session.metadata.planType;

      try {
        await connectDB();

        // Update the doctor's plan
        await User.findByIdAndUpdate(
          userId,
          {
            planType: planType,
            planStartDate: new Date()
          },
          { new: true }
        );

        console.log(`Webhook: Doctor ${userId} subscribed to ${planType} plan`);
      } catch (error) {
        console.error("Webhook processing error for subscription:", error);
      }
    }
  }

  return new Response("OK", { status: 200 });
}