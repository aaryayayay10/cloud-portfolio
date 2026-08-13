const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendConfirmationEmail(inquiry) {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: inquiry.email,
        subject: "Thank you for contacting Aarya Kadam",
        text: `
Hi ${inquiry.full_name},

Thank you for contacting me.

I've received your inquiry and will review your project requirements shortly.

I'll get back to you as soon as possible.

Best regards,

Aarya Kadam
Software Developer
`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendConfirmationEmail
};
