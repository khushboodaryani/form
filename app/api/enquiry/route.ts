// app/api/enquiry/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory storage for testing (remove this in production)
const enquiries: any[] = [];

const dispositionToEmail: Record<string, string | null> = {
  "Customer Support": "ayan@multycomm.com",
  "Consultant Support": "akash@multycomm.com",
  "B2B Lead": "deepak@multycomm.com",
  "New Lead": "aveek@multycomm.com",
  "General Enquiry": null,
};

export async function POST(req: NextRequest) {
  try {
    console.log("API: Received enquiry request");

    const body = await req.json();
    console.log("API: Request body:", body);

    const { name, company, gender, age, email, contact, query, disposition } =
      body;

    // Validation
    if (!name || !email || !disposition) {
      console.log("API: Missing required fields");
      return NextResponse.json(
        {
          ok: false,
          message: "Missing required fields (name, email, disposition)",
        },
        { status: 400 }
      );
    }

    // Create enquiry object
    const enquiry = {
      id: Date.now().toString(),
      name: name.trim(),
      company: (company || "").trim(),
      gender: gender || "Male",
      age: age ? parseInt(age) : null,
      email: email.trim(),
      contact: (contact || "").trim(),
      query: (query || "").trim(),
      disposition,
      createdAt: new Date(),
    };

    console.log("API: Created enquiry:", enquiry);

    // Store in memory (replace with database later)
    enquiries.push(enquiry);

    // Email logic (simplified for testing)
    const to = dispositionToEmail[disposition];
    if (to) {
      console.log(`API: Would send email to: ${to}`);
      // Email sending disabled for testing
    }

    console.log("API: Enquiry saved successfully");

    return NextResponse.json({
      ok: true,
      id: enquiry.id,
      message: "Enquiry submitted successfully",
    });
  } catch (err: any) {
    console.error("API Error details:", err);
    return NextResponse.json(
      {
        ok: false,
        message: err?.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to see stored enquiries (for testing)
export async function GET() {
  return NextResponse.json({
    ok: true,
    enquiries,
    count: enquiries.length,
  });
}
