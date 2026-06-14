import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

// Check if API key exists
if (!process.env.RESEND_API) {
    console.log("Error: Provide RESEND_API in the .env file");
}

// Yahan se quotes hata diye hain
const resend = new Resend(process.env.RESEND_API); 

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'fullstack <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error("Resend Error:", error);
        }

        console.log("Email sent successfully:", data);
        return data;

    } catch (error) {
        console.log("System Error:", error);
    }
}

export default sendEmail;