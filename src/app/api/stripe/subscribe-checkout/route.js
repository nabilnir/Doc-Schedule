import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId, planType } = await req.json();

        if (!userId || !planType) {
            return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
        }

        const headerList = await headers();
        const origin = headerList.get("origin");

        // Define price based on plan Type
        const priceAmount = planType === "yearly" ? 48000 : 5000; // 480 or 50 USD/BDT

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment", // Using payment for simplicity (or "subscription" if using Stripe Billing plans)
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `DocSchedule ${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription`,
                        },
                        unit_amount: priceAmount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/pricing?success=true`,
            cancel_url: `${origin}/pricing?canceled=true`,
            metadata: {
                userId,
                planType,
                isSubscription: "true",
            },
        });

        return new Response(JSON.stringify({ url: session.url }), { status: 200 });
    } catch (error) {
        console.error("Stripe Subscription Checkout Error:", error);
        return new Response(JSON.stringify({ error: "Payment failed" }), { status: 500 });
    }
}
