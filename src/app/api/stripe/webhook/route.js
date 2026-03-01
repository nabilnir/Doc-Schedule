import Stripe from "stripe";

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
    const appointmentId = session.metadata.appointmentId;

    // 1️⃣ Update appointment status → confirmed
    // await Appointment.findByIdAndUpdate(appointmentId, { status: "confirmed" });

    // 2️⃣ Trigger integrations
    // await handleConfirmedAppointment(appointmentId);
  }

  return new Response("OK", { status: 200 });
}