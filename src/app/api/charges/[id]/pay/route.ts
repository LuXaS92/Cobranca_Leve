import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPreference } from "@/lib/mercadopago";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const charge = await prisma.charge.findUnique({
            where: { id },
            include: {
                user: true,
                client: true,
            },
        });

        if (!charge) {
            return NextResponse.json({ error: "Charge not found" }, { status: 404 });
        }

        // @ts-ignore
        if (charge.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if user has MP Access Token configured
        if (!charge.user.mpAccessToken) {
            return NextResponse.json(
                { error: "Mercado Pago access token not configured in settings" },
                { status: 400 }
            );
        }

        // If already has link, return it (Simple caching)
        // if (charge.paymentUrl) {
        //   return NextResponse.json({ init_point: charge.paymentUrl });
        // }

        // Create Preference
        try {
            const preference = await createPreference(charge.user.mpAccessToken, {
                id: charge.id,
                userId: charge.userId,
                amount: Number(charge.amount),
                description: `Cobrança - ${charge.client.name}`,
                dueDate: charge.dueDate,
                client: {
                    name: charge.client.name,
                    email: charge.client.email || undefined,
                },
            });

            if (!preference.init_point) {
                throw new Error("Failed to generate init_point");
            }

            // Save to DB
            await prisma.charge.update({
                where: { id: charge.id },
                data: {
                    paymentUrl: preference.init_point,
                    externalId: preference.id,
                },
            });

            return NextResponse.json({ init_point: preference.init_point });

        } catch (mpError: any) {
            console.error("Mercado Pago Error:", mpError);
            return NextResponse.json(
                { error: "Failed to create payment link with Mercado Pago" },
                { status: 502 }
            );
        }

    } catch (error) {
        console.error("Error generating payment link:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
