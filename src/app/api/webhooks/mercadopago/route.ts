import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayment } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        const body = await req.json();

        console.log("Webhook received:", body, "UserId:", userId);

        if (!userId) {
            console.error("Webhook missing userId");
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Mercado Pago sends notifications. We are interested in "payment.created" or "payment.updated" usually?
        // Actually, MP Documentation says for Webhooks (v1) we get type: "payment" and data.id
        // Or action: "payment.created"

        // Check if it's a payment notification
        const type = body.type;
        const action = body.action;
        const dataId = body.data?.id;

        if (type === "payment" || action === "payment.created" || action === "payment.updated") {
            if (!dataId) {
                return NextResponse.json({ ok: true }); // Acknowledge but ignore
            }

            // Fetch User to get Access Token
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user || !user.mpAccessToken) {
                console.error("User not found or missing token for webhook:", userId);
                // We still return 200 to avoid MP retrying if it's a config error on our side
                return NextResponse.json({ ok: true });
            }

            // Verify Payment with MP
            try {
                const payment = await getPayment(user.mpAccessToken, dataId);

                if (payment.status === "approved") {
                    const chargeId = payment.external_reference;

                    if (chargeId) {
                        // Update Charge
                        await prisma.charge.update({
                            where: { id: chargeId },
                            data: {
                                status: "PAID",
                                paidAt: new Date(payment.date_approved || new Date().toISOString()),
                                paymentMethod: payment.payment_type_id,
                                externalId: payment.id.toString(),
                            },
                        });
                        console.log(`Charge ${chargeId} marked as PAID via Webhook`);
                    }
                }
            } catch (mpError) {
                console.error("Error fetching payment from MP:", mpError);
                // Verify if we should return 500 to retry or 200 to stop
                // If MP service is down, maybe 500. If token invalid, 200.
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
