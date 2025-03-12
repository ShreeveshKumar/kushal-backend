const { Worker } = require('bullmq');
const redis = require('./redisClient');
const transporter = require('../config/mailconfig');

const worker = new Worker(
    'emailQueue',
    async (job) => {
        const { email } = job.data;
        try {

            if (job.name === 'sendinactiveMail') {
                console.log(`📩 Sending deactivation warning email to ${email}...`);
                await transporter.sendMail({
                    from: process.env.user_mail,
                    to: email,
                    subject: '⚠️ Your Account Has Been Deactivated!',
                    text: 'To Activate your Account just log in again ',
                });
            }

            if (job.name === 'senddeleteMail') {
                console.log(`📩 Sending deletion confirmation email to ${email}...`);
                await transporter.sendMail({
                    from: process.env.user_mail,
                    to: email,
                    subject: '✅ Your Account Has Been Deleted',
                    text: 'Your request for deleting your account has been received. Your data may take up to 15 working days to be fully processed and removed. We’re sorry to see you go. ',
                });
            }
            job.log(`✅ Email sent to ${email}`);
        } catch (err) {
            job.log(`❌ Error sending email: ${err.message}`);
        }
    },
    { connection: redis }
);

module.exports = worker; 