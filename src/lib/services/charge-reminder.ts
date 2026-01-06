import { prisma } from '../prisma';
import { ChargeReminderJob } from '../queue';
import { sendEmail } from '../mail';
import { differenceInDays } from 'date-fns';

// Message templates for each reminder type
const REMINDER_TEMPLATES = {
    before_due: {
        subject: 'Lembrete: Pagamento vence em 3 dias',
        getMessage: (clientName: string, amount: string, dueDate: string) => `
Oi ${clientName}, tudo bem? 😊

Passando só para lembrar que o pagamento de R$ ${amount} vence em 3 dias (${dueDate}).

Se já tiver feito, por favor desconsidere! Qualquer dúvida estou à disposição.
    `.trim(),
    },
    due_day: {
        subject: 'Lembrete: Pagamento vence hoje',
        getMessage: (clientName: string, amount: string, dueDate: string) => `
Olá ${clientName},

Hoje é o dia do vencimento do pagamento de R$ ${amount}.

Caso já tenha realizado, por favor envie o comprovante. Obrigado!
    `.trim(),
    },
    overdue: {
        subject: 'Pagamento em atraso',
        getMessage: (clientName: string, amount: string, dueDate: string) => `
Prezado(a) ${clientName},

Notamos que o pagamento de R$ ${amount} com vencimento em ${dueDate} ainda está pendente.

Por favor, regularize quando possível ou entre em contato caso haja alguma divergência.

Atenciosamente.
    `.trim(),
    },
};

export async function sendChargeReminder(job: ChargeReminderJob) {
    const { chargeId, reminderType, userId } = job;

    // Fetch charge with client data
    const charge = await prisma.charge.findUnique({
        where: { id: chargeId },
        include: { client: true, user: true },
    });

    // Validations
    if (!charge) {
        throw new Error(`Charge ${chargeId} not found`);
    }

    if (charge.userId !== userId) {
        throw new Error(`Unauthorized: Charge ${chargeId} does not belong to user ${userId}`);
    }

    if (charge.status === 'PAID') {
        console.log(`Skipping reminder for charge ${chargeId}: already paid`);
        return { skipped: true, reason: 'already_paid' };
    }

    // Check if reminder already sent
    const alreadySent =
        (reminderType === 'before_due' && charge.reminderBeforeSent) ||
        (reminderType === 'due_day' && charge.reminderDueSent) ||
        (reminderType === 'overdue' && charge.reminderAfterSent);

    if (alreadySent) {
        console.log(`Skipping reminder for charge ${chargeId}: ${reminderType} already sent`);
        return { skipped: true, reason: 'already_sent' };
    }

    // Get template
    const template = REMINDER_TEMPLATES[reminderType];
    const clientName = charge.client.name.split(' ')[0]; // First name only
    const amount = Number(charge.amount).toFixed(2);
    const dueDate = new Date(charge.dueDate).toLocaleDateString('pt-BR');

    const message = template.getMessage(clientName, amount, dueDate);
    const messageHtml = message.replace(/\n/g, '<br>');

    // Send via email if client has email
    if (charge.client.email) {
        try {
            await sendEmail({
                to: charge.client.email,
                subject: template.subject,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #14b8a6; text-align: center;">Cobrança Leve</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151;">
              ${messageHtml}
            </div>
            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
              Enviado via Cobrança Leve
            </p>
          </div>
        `,
            });
            console.log(`✉️ Email sent to ${charge.client.email} for charge ${chargeId}`);
        } catch (error) {
            console.error(`Failed to send email for charge ${chargeId}:`, error);
            throw error;
        }
    }

    // Update charge with reminder flag
    const updateData: any = {
        lastReminderSentAt: new Date(),
    };

    if (reminderType === 'before_due') {
        updateData.reminderBeforeSent = true;
    } else if (reminderType === 'due_day') {
        updateData.reminderDueSent = true;
    } else if (reminderType === 'overdue') {
        updateData.reminderAfterSent = true;
    }

    await prisma.charge.update({
        where: { id: chargeId },
        data: updateData,
    });

    console.log(`✅ Reminder ${reminderType} sent for charge ${chargeId}`);

    return {
        success: true,
        chargeId,
        reminderType,
        sentTo: charge.client.email || charge.client.whatsapp,
    };
}

export function getReminderType(charge: any): 'before_due' | 'due_day' | 'overdue' | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(charge.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const daysUntilDue = differenceInDays(dueDate, today);

    if (daysUntilDue === 3 && !charge.reminderBeforeSent) {
        return 'before_due';
    }

    if (daysUntilDue === 0 && !charge.reminderDueSent) {
        return 'due_day';
    }

    if (daysUntilDue < 0 && !charge.reminderAfterSent) {
        return 'overdue';
    }

    return null;
}
