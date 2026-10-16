"use client";

import { useState } from "react";
import { JobPosting } from "@/types/job";

interface ApplySectionProps {
  job: JobPosting;
}

export default function ApplySection({ job }: ApplySectionProps) {
  const [copied, setCopied] = useState(false);

  const emailSubject = `Application: ${job.title} - [Your Full Name]`;
  const emailBody = `Dear Hubani Hiring Team,

I am writing to apply for the position of ${job.title} (${job.subtitle || ""}) at Hubani Limited.

Candidate Information:
- Full Name: 
- Phone Number: 
- Current Location: 
- Current Status (Student / Recent Graduate / Early Career): 
- Availability / Notice Period: 
- LinkedIn / Portfolio (optional): 

Why I am excited to learn, grow, and contribute to Hubani Limited:
[Please write a brief statement here]

I have attached my CV / Resume in PDF format to this email.

Best regards,
[Your Full Name]`;

  const mailtoLink = `mailto:${job.applicationEmail}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyTemplate = async () => {
    const fullTextToCopy = `To: ${job.applicationEmail}\nSubject: ${emailSubject}\n\n${emailBody}`;
    try {
      await navigator.clipboard.writeText(fullTextToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = fullTextToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <section
      id="apply"
      className="border border-neutral-300 rounded bg-neutral-50/50 p-6 shadow-xs scroll-mt-24 space-y-6"
    >
      <div className="border-b border-neutral-200 pb-4 space-y-1">
        <h2 className="text-xl font-semibold text-black tracking-tight">
          Apply for this Role
        </h2>
        <p className="text-xs text-neutral-600">
          Position: <span className="font-semibold text-neutral-900">{job.title}</span> ({job.subtitle})
        </p>
      </div>

      <div className="space-y-3 text-sm text-neutral-700 leading-relaxed">
        <p>
          At Hubani Limited, we value potential, dedication, and high trainability. To apply, submit your application directly to our official inbox at{" "}
          <a
            href={`mailto:${job.applicationEmail}`}
            className="font-semibold text-black underline underline-offset-2"
          >
            {job.applicationEmail}
          </a>
          .
        </p>

        <div className="rounded border border-neutral-200 bg-white p-4 space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900">
            Application Submission Checklist:
          </h3>
          <ul className="text-xs text-neutral-600 space-y-1.5 list-disc pl-4">
            <li>
              <strong>Updated CV / Resume</strong>: Attach in PDF format.
            </li>
            <li>
              <strong>Brief Statement / Cover Note</strong>: Explaining why you are excited to learn and grow with Hubani Limited.
            </li>
            <li>
              <strong>Availability</strong>: State your earliest availability or notice period.
            </li>
            <li>
              <strong>Target Profile</strong>: Students and recent graduates are explicitly encouraged to apply.
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <a
          href={mailtoLink}
          className="inline-flex items-center justify-center gap-2 rounded bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <span>Open Email Client</span>
          <span aria-hidden="true">↗</span>
        </a>

        <button
          type="button"
          onClick={handleCopyTemplate}
          className="inline-flex items-center justify-center gap-2 rounded border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors shadow-xs"
        >
          {copied ? (
            <>
              <span className="text-emerald-700 font-semibold">✓ Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <span>Copy Email Template</span>
              <span className="text-xs text-neutral-500 font-normal">(for Gmail / Webmail)</span>
            </>
          )}
        </button>
      </div>

      <div className="rounded bg-white border border-neutral-200 p-3.5 text-xs text-neutral-500 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-800">Application Email:</span>
          <span className="font-mono text-neutral-900">{job.applicationEmail}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-800">Deadline:</span>
          <span>{job.deadlineText}</span>
        </div>
      </div>
    </section>
  );
}
