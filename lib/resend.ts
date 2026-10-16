import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "";
export const resend = new Resend(apiKey);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Hubani Careers <careers@hubani.org>";
export const HR_EMAIL =
  process.env.HR_NOTIFICATION_EMAIL || "careers@hubani.org";

interface CandidateApplicationEmailData {
  jobTitle: string;
  jobSlug: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  location: string;
  status: string;
  availability: string;
  portfolioUrl?: string;
  coverStatement: string;
  fileName: string;
  fileBuffer: Buffer;
  minioDownloadUrl: string;
}

/**
 * Sends notification email to HR team with attached CV and secure MinIO download link.
 */
export async function sendHrNotificationEmail(
  data: CandidateApplicationEmailData
) {
  const hrHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Job Application</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #111827; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 4px; padding: 24px;">
          <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 3px;">
              HUBANI CAREERS
            </span>
            <h2 style="font-size: 18px; font-weight: 600; margin: 12px 0 4px 0; color: #000000;">
              New Application: ${data.jobTitle}
            </h2>
            <p style="font-size: 13px; color: #6b7280; margin: 0;">
              Received on ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })} EAT
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 140px; font-weight: 600;">Candidate Name:</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 600;">${data.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Email Address:</td>
              <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #000000;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Phone / WhatsApp:</td>
              <td style="padding: 6px 0; color: #111827;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Gender:</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 600;">${data.gender}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Location:</td>
              <td style="padding: 6px 0; color: #111827;">${data.location}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Candidate Status:</td>
              <td style="padding: 6px 0; color: #111827;">${data.status}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Earliest Availability:</td>
              <td style="padding: 6px 0; color: #111827;">${data.availability}</td>
            </tr>
            ${
              data.portfolioUrl
                ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Portfolio / LinkedIn:</td>
              <td style="padding: 6px 0;"><a href="${data.portfolioUrl}" target="_blank" style="color: #000000;">${data.portfolioUrl}</a></td>
            </tr>`
                : ""
            }
          </table>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
            <h4 style="font-size: 13px; font-weight: 600; margin: 0 0 8px 0; color: #111827;">
              Cover Statement / Motivation:
            </h4>
            <p style="font-size: 13px; color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">
              ${data.coverStatement}
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0 0 8px 0;">
              <strong>Resume / CV:</strong> ${data.fileName} (also attached to this email).
            </p>
            <p style="margin: 0;">
              <a href="${data.minioDownloadUrl}" target="_blank" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 3px;">
                Download CV from MinIO Storage (7-Day Secure Link) →
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: HR_EMAIL,
    replyTo: data.email,
    subject: `[New Application] ${data.jobTitle} - ${data.fullName}`,
    html: hrHtml,
    attachments: [
      {
        filename: data.fileName,
        content: data.fileBuffer,
      },
    ],
  });
}

/**
 * Sends a confirmation email to the applicant.
 */
export async function sendApplicantConfirmationEmail(
  data: Pick<CandidateApplicationEmailData, "fullName" | "email" | "jobTitle">
) {
  const applicantHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Application Received - Hubani Limited</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #111827; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 4px; padding: 24px;">
          <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 3px;">
              HUBANI LIMITED
            </span>
            <h2 style="font-size: 18px; font-weight: 600; margin: 12px 0 4px 0; color: #000000;">
              Application Received: ${data.jobTitle}
            </h2>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
            Dear ${data.fullName},
          </p>

          <p style="font-size: 13px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
            Thank you for applying for the position of <strong>${data.jobTitle}</strong> at Hubani Limited. We have successfully received your application materials and CV.
          </p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.6; color: #4b5563;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">What to expect next:</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 6px;">Our leadership team conducts rolling reviews of candidate applications.</li>
              <li style="margin-bottom: 6px;">We prioritize enthusiasm, trainability, and dedication over legacy tenure.</li>
              <li>If your profile is shortlisted, our team will reach out directly via email or phone to schedule an introductory conversation.</li>
            </ul>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
            If you need to update any details regarding your application or have questions in the meantime, feel free to reply directly to this email at <a href="mailto:careers@hubani.org" style="color: #000000; font-weight: 600;">careers@hubani.org</a>.
          </p>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #111827;">Executive Office & Corporate Governance Secretariat</p>
            <p style="margin: 0 0 4px 0;">Hubani Limited · Mombasa, Kenya</p>
            <p style="margin: 0;"><a href="https://hubani.org" style="color: #6b7280;">hubani.org</a> · <a href="https://careers.hubani.org" style="color: #6b7280;">careers.hubani.org</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `Application Confirmation: ${data.jobTitle} - Hubani Limited`,
    html: applicantHtml,
  });
}
