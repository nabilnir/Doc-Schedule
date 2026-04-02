// app/api/stripe/webhook/route.js

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Find the pending notification using the stripeSessionId and update it
    await Notification.findOneAndUpdate(
      { stripeSessionId: session.id }, 
      { 
        status: "confirmed",
        message: `Appointment successfully booked with ${session.metadata.doctorName}`
      }
    );
    
    console.log("Notification status updated to CONFIRMED");
  }

  return new Response("Success", { status: 200 });
}