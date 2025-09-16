const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
        port: process.env.SMTP_PORT, // e.g., 465
        service: process.env.SMTP_SERVICE, // e.g., "gmail"
        secure: true, // use SSL if using port 465
        auth: {
            user: process.env.SMTP_MAIL,       // your email
            pass: process.env.SMTP_PASS,       // your app password
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", options.email); // Debug log
};

module.exports = sendEmail;
