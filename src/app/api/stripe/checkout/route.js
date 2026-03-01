import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { appointmentId, fee, patientEmail } = await req.json();

    const headerList = await headers();
    const origin = headerList.get('origin')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientEmail,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "Doctor Appointment Fee",
            },
            unit_amount: fee * 100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-cancel`,
      metadata: {
        appointmentId,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return new Response(
      JSON.stringify({ error: "Payment failed" }),
      { status: 500 }
    );
  }
}