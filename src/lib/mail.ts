import nodemailer from 'nodemailer';

// Use Ethereal for development if no env vars are present
const smtpOptions = {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass',
    },
};

export const transporter = nodemailer.createTransport(smtpOptions);

export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (data: EmailPayload) => {
    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Cobrança Leve" <no-reply@cobrancaleve.com.br>',
        ...data,
    });

    if (process.env.NODE_ENV === 'development') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
};
