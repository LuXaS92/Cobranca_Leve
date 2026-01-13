import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { plan } = body;

        // Only PRO plan supported for now
        if (plan !== 'PRO') {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // This is the SaaS Platform's Access Token (The User's Project Token)
        const platformAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

        if (!platformAccessToken) {
            console.error("Missing MERCADO_PAGO_ACCESS_TOKEN env var");
            return NextResponse.json({ error: "Server misconfiguration: Missing MP Token" }, { status: 500 });
        }

        // @ts-ignore
        const userId = session.user.id;
        // @ts-ignore
        const userEmail = session.user.email;
        // @ts-ignore
        const userName = session.user.name;

        // Initialize MP Client for Platform
        const client = new MercadoPagoConfig({ accessToken: platformAccessToken });
        const preference = new Preference(client);

        // Determine Base URL
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        console.log("Subscription Checkout - Base URL:", baseUrl);

        // Create checkout preference
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: `PLAN_${plan}`,
                        title: `Assinatura Plano ${plan} - Cobrança Leve`,
                        quantity: 1,
                        unit_price: 29.90, // Hardcoded price for MVP
                        currency_id: 'BRL',
                    },
                ],
                payer: {
                    name: userName || 'Usuário',
                    email: userEmail || 'email@naoinformado.com',
                },
                external_reference: userId, // We store userId here to identify who paid
                back_urls: {
                    success: `https://www.google.com`,
                    failure: `${baseUrl}/dashboard/subscription?status=failure`,
                    pending: `${baseUrl}/dashboard/subscription?status=pending`,
                },
                auto_return: 'approved',
                // Special notification URL to distinguish from regular user charges
                notification_url: `${baseUrl}/api/webhooks/mercadopago?type=subscription`,
            },
        });

        if (!result.init_point) {
            throw new Error("Failed to generate payment link");
        }

        return NextResponse.json({
            success: true,
            paymentUrl: result.init_point
        });

    } catch (error) {
        console.error("Subscription Checkout Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
