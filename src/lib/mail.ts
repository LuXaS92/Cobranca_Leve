import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

async function createTransporter() {
    if (transporter) return transporter;

    // If SMTP credentials are provided, use them
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return transporter;
    }

    // Otherwise, create an Ethereal test account for development
    try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('📧 Using Ethereal Email for development');
        console.log('   User:', testAccount.user);
        return transporter;
    } catch (error) {
        console.error('Failed to create Ethereal test account:', error);
        throw new Error('Email configuration failed. Please set SMTP environment variables.');
    }
}

export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (data: EmailPayload) => {
    const mailer = await createTransporter();

    const info = await mailer.sendMail({
        from: process.env.SMTP_FROM || '"Cobrança Leve" <no-reply@cobrancaleve.com.br>',
        ...data,
    });

    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('📬 Email sent!');
        console.log('   Preview URL:', previewUrl);
    }

    return info;
};
