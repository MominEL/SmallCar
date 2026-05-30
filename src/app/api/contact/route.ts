import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL || "smallcar.pms@gmail.com";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message, carName } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subject = carName
      ? `New Enquiry: ${carName} — SmallCar`
      : `General Enquiry — SmallCar`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Enquiry via SmallCar Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        ${carName ? `<p><strong>Car of Interest:</strong> ${carName}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <h3 style="color: #333;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
    `;

    const { data: resendData, error } = await resend.emails.send({
      from: "SmallCar Enquiries <onboarding@resend.dev>", // Replace with verified domain later
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: resendData });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
