const nodemailer = require('nodemailer');
// You can run this file with 'node test-email.js'
// BUT FIRST: Make sure you have your email and app-password ready.

const EMAIL_USER = "YOUR_EMAIL_HERE@gmail.com";
const EMAIL_PASS = "YOUR_16_LETTER_APP_PASSWORD_HERE";

async function test() {
    console.log("Attempting to send test email...");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Email Test" <${EMAIL_USER}>`,
            to: EMAIL_USER, // Send to yourself
            subject: "Nodemailer Test Works!",
            text: "If you are reading this, your settings are CORRECT.",
            html: "<b>If you are reading this, your settings are CORRECT.</b>",
        });

        console.log("✅ SUCCESS! Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ FAILED!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        if (error.message.includes("535 5.7.8")) {
            console.log("\n--- TROUBLESHOOTING ---");
            console.log("1. This means your password or email is INCORRECT.");
            console.log("2. DO NOT use your real Gmail password.");
            console.log("3. You MUST use a 16-letter 'App Password'.");
            console.log("4. If the link didn't work, search 'App Passwords' in the search bar of your Google Account.");
        }
    }
}

test();
