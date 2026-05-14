// app/api/create-paymongo-checkout/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const booking = await req.json();

    const amount = Number(booking.receipt.total) * 100;

    const response = await fetch(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString(
              "base64"
            ),
        },
        body: JSON.stringify({
          data: {
            attributes: {
              line_items: [
                {
                  currency: "PHP",
                  amount,
                  name: booking.receipt.packageName,
                  quantity: 1,
                },
              ],
              payment_method_types: ["gcash", "card", "paymaya"],
              success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
              cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-cancelled`,
              description: `Booking ${booking.confirmationNumber}`,
              reference_number: booking.confirmationNumber,
            },
          },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      checkoutUrl: data.data?.attributes?.checkout_url,
      checkoutId: data.data?.id,
    });
  } catch {
    return NextResponse.json(
      { error: "PayMongo checkout failed." },
      { status: 500 }
    );
  }
}