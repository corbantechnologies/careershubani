"use client";

import { useState, useRef } from "react";
import { JobPosting } from "@/types/job";

interface ApplySectionProps {
  job: JobPosting;
}

export default function ApplySection({ job }: ApplySectionProps) {
  const [mode, setMode] = useState<"form" | "email">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    status: "Student / Recent Graduate",
    availability: "Immediate / 2 Weeks",
    portfolioUrl: "",
    coverStatement: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB limit. Please attach a smaller file.");
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedFile) {
      setErrorMessage("Please attach your CV / Resume before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = new FormData();
      body.append("jobSlug", job.slug);
      body.append("jobTitle", job.title);
      body.append("fullName", formData.fullName);
      body.append("email", formData.email);
      body.append("phone", formData.phone);
      body.append("location", formData.location);
      body.append("status", formData.status);
      body.append("availability", formData.availability);
      body.append("portfolioUrl", formData.portfolioUrl);
      body.append("coverStatement", formData.coverStatement);
      body.append("resume", selectedFile);

      const res = await fetch("/api/apply", {
        method: "POST",
        body,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      setSuccessMessage(result.message);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        status: "Student / Recent Graduate",
        availability: "Immediate / 2 Weeks",
        portfolioUrl: "",
        coverStatement: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. You can also apply via direct email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Email Fallback Templates
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
      className="border border-neutral-300 rounded bg-white p-5 sm:p-7 shadow-xs scroll-mt-24 space-y-6"
    >
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-black tracking-tight">
            Apply for this Role
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Position: <span className="font-semibold text-neutral-900">{job.title}</span> ({job.subtitle})
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded border border-neutral-200 bg-neutral-100 p-0.5 text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("form")}
            className={`rounded px-3 py-1 transition-colors ${
              mode === "form"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Online Application Form
          </button>
          <button
            type="button"
            onClick={() => setMode("email")}
            className={`rounded px-3 py-1 transition-colors ${
              mode === "email"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Direct Email
          </button>
        </div>
      </div>

      {/* Mode A: Inbuilt Form with MinIO & Resend */}
      {mode === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {successMessage && (
            <div className="rounded border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 space-y-1">
              <p className="font-semibold text-emerald-950 flex items-center gap-1.5">
                <span>✓</span> {successMessage}
              </p>
              <p className="text-emerald-800">
                A confirmation receipt has been dispatched to your email address. Our leadership team reviews applications on a rolling basis.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="rounded border border-red-300 bg-red-50 p-4 text-xs text-red-900">
              <span className="font-semibold">Submission Error:</span> {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-neutral-900"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Amani Mwangi"
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-neutral-900"
              >
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-neutral-900"
              >
                Phone Number / WhatsApp <span className="text-red-600">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+254 7XX XXX XXX"
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="location"
                className="block text-xs font-semibold text-neutral-900"
              >
                Current Location (City, Country) <span className="text-red-600">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Mombasa, Nairobi, or Remote"
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="status"
                className="block text-xs font-semibold text-neutral-900"
              >
                Current Candidate Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-black focus:outline-none transition-colors"
              >
                <option value="University Student">University Student (Undergraduate / Postgrad)</option>
                <option value="Recent Graduate">Recent Graduate</option>
                <option value="Early Career Professional">Early Career Professional</option>
                <option value="Experienced Executive">Experienced Executive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="availability"
                className="block text-xs font-semibold text-neutral-900"
              >
                Earliest Availability / Notice Period <span className="text-red-600">*</span>
              </label>
              <input
                id="availability"
                name="availability"
                type="text"
                required
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g. Immediate / 2 Weeks"
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="portfolioUrl"
              className="block text-xs font-semibold text-neutral-900"
            >
              LinkedIn Profile or Portfolio / GitHub (Optional)
            </label>
            <input
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              value={formData.portfolioUrl}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="coverStatement"
              className="block text-xs font-semibold text-neutral-900"
            >
              Cover Statement / Motivation <span className="text-red-600">*</span>
            </label>
            <p className="text-[11px] text-neutral-500">
              Briefly describe why you are excited to learn, grow, and contribute to Hubani Limited.
            </p>
            <textarea
              id="coverStatement"
              name="coverStatement"
              rows={4}
              required
              value={formData.coverStatement}
              onChange={handleInputChange}
              placeholder="Tell us about your background, mindset, trainability, and what excites you about this role..."
              className="w-full rounded border border-neutral-300 bg-white p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors leading-relaxed"
            />
          </div>

          {/* File Upload Box */}
          <div className="space-y-1.5">
            <label
              htmlFor="resume"
              className="block text-xs font-semibold text-neutral-900"
            >
              Upload CV / Resume (PDF or DOCX, max 10MB) <span className="text-red-600">*</span>
            </label>
            <div className="rounded border border-dashed border-neutral-300 bg-neutral-50/50 p-4 text-center">
              <input
                ref={fileInputRef}
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                required
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
              >
                Choose File
              </button>
              {selectedFile ? (
                <div className="mt-2 text-xs font-medium text-emerald-800 flex items-center justify-center gap-2">
                  <span>📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-600 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-xs text-neutral-500">
                  Select your CV in PDF or DOCX format. Securely stored in private MinIO storage.
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? (
                <span>Submitting Application...</span>
              ) : (
                <span>Submit Application to Hubani</span>
              )}
            </button>

            <span className="text-[11px] text-neutral-500">
              An automated receipt will be emailed to your inbox upon submission.
            </span>
          </div>
        </form>
      )}

      {/* Mode B: Direct Email Option */}
      {mode === "email" && (
        <div className="space-y-4">
          <div className="space-y-2 text-xs text-neutral-700 leading-relaxed">
            <p>
              If you prefer submitting directly through your email client (or webmail), send your CV and cover note to{" "}
              <a
                href={`mailto:${job.applicationEmail}`}
                className="font-semibold text-black underline underline-offset-2"
              >
                {job.applicationEmail}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <a
              href={mailtoLink}
              className="inline-flex items-center justify-center gap-2 rounded bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>Open Default Email Client</span>
              <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center justify-center gap-2 rounded border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors shadow-xs"
            >
              {copied ? (
                <span className="text-emerald-700 font-semibold">✓ Copied to Clipboard!</span>
              ) : (
                <span>Copy Email Template (for Gmail / Webmail)</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Responsive Footer Details - no overlapping text */}
      <div className="rounded bg-neutral-50 border border-neutral-200 p-3.5 text-xs text-neutral-600 space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
          <span className="font-semibold text-neutral-800">Recruitment Contact:</span>
          <span className="font-mono text-neutral-900 break-all">{job.applicationEmail}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
          <span className="font-semibold text-neutral-800">Review Cadence:</span>
          <span className="text-neutral-700">{job.deadlineText}</span>
        </div>
      </div>
    </section>
  );
}
