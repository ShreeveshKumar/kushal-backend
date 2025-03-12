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



module.exports = transporter; 