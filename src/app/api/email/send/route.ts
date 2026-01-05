import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";

const sendEmailSchema = z.object({
    clientId: z.string().uuid(),
    amount: z.string(),
    dueDate: z.string(),
    messageHtml: z.string(), // We'll receive the pre-formatted message
    subject: z.string().default("Lembrete de Pagamento"),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const body = await req.json();
        const { clientId, messageHtml, subject, amount } = sendEmailSchema.parse(body);

        const client = await prisma.client.findUnique({
            where: { id: clientId }
        });

        if (!client || client.userId !== userId) {
            return NextResponse.json({ message: "Cliente não encontrado" }, { status: 404 });
        }

        if (!client.email) {
            return NextResponse.json({ message: "Cliente não possui email cadastrado" }, { status: 400 });
        }

        // Wrap message in a nice template
        const finalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #14b8a6; text-align: center;">Cobrança Leve</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; white-space: pre-wrap;">
          ${messageHtml}
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          Enviado via Cobrança Leve
        </p>
      </div>
    `;

        await sendEmail({
            to: client.email,
            subject: subject,
            html: finalHtml
        });

        // Record the activity (Optional: Create a Charge record if not exists, or verify user limits first)
        // For MVP, we assume the user is just sending a message. But ideally we should count this.

        return NextResponse.json({ success: true });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: (error as any).errors[0].message }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: "Erro ao enviar email" }, { status: 500 });
    }
}
