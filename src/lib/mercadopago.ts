import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

/**
 * Retrieves payment information from Mercado Pago.
 * @param accessToken User's MP Access Token
 * @param paymentId Mercado Pago Payment ID
 */
export async function getPayment(accessToken: string, paymentId: string) {
    const client = new MercadoPagoConfig({ accessToken: accessToken });
    // There isn't a direct "Payment" class exposed easily in v2 same way, usually Payment is imported.
    // Checking docs: import { Payment } from 'mercadopago';
    // const payment = new Payment(client);
    // return await payment.get({ id: paymentId });

    // Using direct fetch if SDK types allow, or correct class usage.
    // Assuming 'Payment' class exists in SDK.
    // To avoid import issues if not sure, we can use fetch or try to import it.
    // Let's assume common usage.

    // Dynamic import or assume standard import
    // const { Payment } = await import('mercadopago'); // Already imported at the top
    const payment = new Payment(client);
    return await payment.get({ id: paymentId });
}

/**
 * Creates a Mercado Pago Preference for a given charge.
 * @param accessToken User's MP Access Token
 * @param charge Charge details (id, amount, description, client info)
 * @returns Preference configuration including init_point (payment link)
 */
export async function createPreference(accessToken: string, charge: {
    id: string;
    userId: string; // Added userId
    amount: number;
    description: string;
    dueDate: Date;
    client: {
        name: string;
        email?: string;
    }
}) {
    const client = new MercadoPagoConfig({ accessToken: accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
        body: {
            items: [
                {
                    id: charge.id,
                    title: charge.description,
                    quantity: 1,
                    unit_price: Number(charge.amount),
                    currency_id: 'BRL',
                },
            ],
            payer: {
                name: charge.client.name,
                email: charge.client.email || 'email@naoinformado.com',
            },
            external_reference: charge.id,
            back_urls: {
                success: `${process.env.NEXTAUTH_URL}/dashboard/charges?status=success`,
                failure: `${process.env.NEXTAUTH_URL}/dashboard/charges?status=failure`,
                pending: `${process.env.NEXTAUTH_URL}/dashboard/charges?status=pending`,
            },
            auto_return: 'approved',
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12, // Allow installments
            },
            notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago?userId=${charge.userId}`,
            expires: true,
            expiration_date_to: new Date(charge.dueDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Expires 1 day after due date (example logic)
        },
    });

    return result;
}
