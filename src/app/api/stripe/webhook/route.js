import { headers } from "next/headers";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import { handleConfirmedAppointment } from "@/app/actions/book-appointment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;

  try {
    // Verify the webhook signature to ensure it's from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the specific event: checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Retrieve appointmentId from metadata sent during checkout
    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      console.log(`LOG: Payment successful for Appointment: ${appointmentId}`);
      
      try {
        await connectDB();
        // This function updates the DB to 'paid', sends Email & Google Calendar invite
        await handleConfirmedAppointment(appointmentId);
      } catch (error) {
        console.error("LOG: Error updating appointment via webhook:", error);
      }
    }
  }

  return new Response("Webhook Received", { status: 200 });
}