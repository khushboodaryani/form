// app/api/enquiry/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Keep top-level minimal — do NOT import prisma or nodemailer here.
// We'll require them lazily inside the handler to avoid module-eval issues.

const dispositionToEmail: Record<string, string | null> = {
  "Customer Support": "ayan@multycomm.com",
  "Consultant Support": "akash@multycomm.com",
  "B2B Lead": "deepak@multycomm.com",
  "New Lead": "aveek@multycomm.com",
  "General Enquiry": null,
};

export async function POST(req: NextRequest) {
  try {
    const { prisma } = require("@/lib/prisma") as { prisma: any };
    const nodemailer = require("nodemailer") as typeof import("nodemailer");

    const body = await req.json();

    const { name, company, gender, age, email, contact, query, disposition } =
      body as {
        name: string;
        company?: string;
        gender?: string;
        age?: number | string;
        email: string;
        contact?: string;
        query?: string;
        disposition: string;
      };

    if (!name || !email || !disposition) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing required fields (name, email, disposition)",
        },
        { status: 400 }
      );
    }

    // create record
    const saved = await prisma.enquiry.create({
      data: {
        name,
        company: company ?? "",
        gender: gender ?? "",
        age: Number(age || 0),
        email,
        contact: contact ?? "",
        query: query ?? "",
        disposition,
      },
    });

    const to = dispositionToEmail[disposition] ?? null;

    if (to) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const subject = "New Client Enquiry from MultyComm Form";
      const text = `
Greetings!

We have received an inquiry for the client detailed below. Please provide them with the necessary assistance.

Client/Caller Name: ${name}
Company: ${company ?? ""}
Gender: ${gender ?? ""}
Age: ${age ?? ""}
Email: ${email}
Query: ${query ?? ""}

Thank You!
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
        to,
        subject,
        text,
      });
    }

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err: any) {
    console.error("API /api/enquiry error:", err);
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
