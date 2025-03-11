const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.user_mail,
        pass: process.env.user_mail_pass
    },
});

const sendMail = async ({ subject, message, user }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.user_mail,
            to: { user },
            subject: `${subject}`,
            text: `${message}`,
        });

        console.log("Message sent: %s", info.messageId);

    } catch (err) {
        console.log("Some error occured in sending mail", err);
        return err;
    }
}



module.exports = sendMail; 