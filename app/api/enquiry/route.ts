import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


const dispositionToEmail: Record<string, string | null> = {
    "customer Support": "ayan@multycomm.com",
    "consultant Support": "akash@multycomm.com",
    "B2B LEad": "deepak@multycomm.com",
    "New Lead": "aveek@multycomm.com",
    "General Enquiry": null,
};
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            name,company,gender,age, email,contact,query, disposition,
        } = body;
    

    const record = await prisma.enquiry.create({
        data: {
            name, company , gender, age: Number(age), email, contact, query, disposition
        }
    })

    if (to) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
        const subject = "new Client Enquiry from Multycomm FORM";
        const text = `
        Greetings!
        we have received an inquiry for the cleint detialed below. Please provide them the necessary assistance
        Client/ca;;er Name: ${name}
        Company: ${company}
        Gender: ${gender}
        Age: ${age}
        Email: ${email}
        Query: ${query}
        Thank You!
        `;
        await transporter.sendMail({
            from: process.env.EMAIL_FORM,
            to,
            subject,
            text,
        })
    }
    return NextResponse.json({ok: true});
}catch(err:any){
    console.log(err);
    return NextResponse.json({ok: false, error: err.message}, {status: 500});
}

}