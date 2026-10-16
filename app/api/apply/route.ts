import { NextRequest, NextResponse } from "next/server";
import { uploadResumeToMinio } from "@/lib/minio";
import {
  sendHrNotificationEmail,
  sendApplicantConfirmationEmail,
} from "@/lib/resend";

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jobSlug = formData.get("jobSlug") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const status = formData.get("status") as string;
    const availability = formData.get("availability") as string;
    const portfolioUrl = (formData.get("portfolioUrl") as string) || "";
    const coverStatement = formData.get("coverStatement") as string;
    const resumeFile = formData.get("resume") as File | null;

    // Validate required fields
    if (
      !jobSlug ||
      !jobTitle ||
      !fullName ||
      !email ||
      !phone ||
      !location ||
      !status ||
      !availability ||
      !coverStatement ||
      !resumeFile
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields and attach your CV." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate file size (10 MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (resumeFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Resume file size must be less than 10MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await resumeFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 1. Upload to private MinIO storage
    const { objectName, presignedUrl } = await uploadResumeToMinio(
      fileBuffer,
      resumeFile.name,
      resumeFile.type,
      jobSlug
    );

    console.log(`[MinIO] Uploaded ${objectName} successfully.`);

    // 2. Dispatch emails via Resend
    // Send HR alert with attachment and MinIO download URL
    await sendHrNotificationEmail({
      jobTitle,
      jobSlug,
      fullName,
      email,
      phone,
      location,
      status,
      availability,
      portfolioUrl,
      coverStatement,
      fileName: resumeFile.name,
      fileBuffer,
      minioDownloadUrl: presignedUrl,
    });

    // Send confirmation to the applicant
    await sendApplicantConfirmationEmail({
      fullName,
      email,
      jobTitle,
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! A confirmation email has been sent to your address.",
    });
  } catch (error: unknown) {
    console.error("[Application API Error]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process application.";
    return NextResponse.json(
      { error: `Unable to submit application: ${message}` },
      { status: 500 }
    );
  }
}
