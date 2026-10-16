import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllJobs, getJobBySlug } from "@/lib/jobs";
import ApplySection from "@/components/ApplySection";
import JobSchema from "@/components/JobSchema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const jobs = getAllJobs();
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | Hubani Careers",
      description: "The requested career opportunity does not exist or has been filled.",
    };
  }

  const pageTitle = `${job.title} (${job.subtitle || job.department})`;
  const pageDescription = `${job.roleSummary} Located in ${job.location.type} (${job.location.city || ""}, ${job.location.country}). Open to students and early-career talent.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `https://careers.hubani.org/jobs/${job.slug}`,
    },
    openGraph: {
      title: `${pageTitle} | Hubani Careers`,
      description: pageDescription,
      url: `https://careers.hubani.org/jobs/${job.slug}`,
      type: "article",
      siteName: "Hubani Careers",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      {/* Schema.org JobPosting JSON-LD for Google Jobs indexing */}
      <JobSchema job={job} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-black transition-colors">
            Careers
          </Link>
          <span aria-hidden="true">/</span>
          <span>{job.department}</span>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-900 font-medium truncate">{job.title}</span>
        </nav>

        {/* Role Header Banner */}
        <header className="border border-neutral-200 rounded bg-white p-5 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 border border-neutral-200">
              {job.department}
            </span>
            <span className="rounded bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
              {job.location.type} · {job.location.workplaceAddress}
            </span>
            <span className="rounded bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
              {job.employmentType}
            </span>
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
              {job.title}
            </h1>
            {job.subtitle && (
              <p className="text-sm font-medium text-neutral-600 mt-1">
                {job.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <div className="space-y-0.5">
              <span className="font-semibold text-neutral-900 block">Reporting Line:</span>
              <span className="break-words">{job.reportingLine}</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-neutral-900 block">Engagement Framework:</span>
              <span className="break-words">{job.engagementFramework}</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-neutral-900 block">Target Candidate Profile:</span>
              <span className="text-neutral-800 break-words">{job.targetProfile}</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-neutral-900 block">Application Deadline:</span>
              <span className="text-neutral-800 break-words">{job.deadlineText}</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>Apply for this Position</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </header>

        {/* Section 1: About Hubani Limited & Culture */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 border-b border-neutral-200 pb-2">
            1. About Hubani Limited &amp; Culture
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {job.aboutCompany}
          </p>
        </section>

        {/* Section 2: Executive Role Summary */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 border-b border-neutral-200 pb-2">
            2. Executive Role Summary
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {job.roleSummary}
          </p>
          {job.extendedSummary && (
            <p className="text-sm text-neutral-700 leading-relaxed">
              {job.extendedSummary}
            </p>
          )}
        </section>

        {/* Section 3: Core Responsibilities & Key Accountabilities */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 border-b border-neutral-200 pb-2">
            3. Core Responsibilities &amp; Key Accountabilities
          </h2>
          <div className="space-y-6">
            {job.responsibilityGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-neutral-100 text-[11px] font-semibold text-neutral-800 border border-neutral-200">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {group.category}
                </h3>
                <ul className="space-y-2 pl-7 list-disc text-xs text-neutral-700 leading-relaxed">
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Candidate Profile, Mindset & Potential */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 border-b border-neutral-200 pb-2">
            4. Candidate Profile, Mindset &amp; Potential
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {job.candidateProfileIntro}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
            {job.candidateProfilePoints.map((point, idx) => (
              <div
                key={idx}
                className="rounded border border-neutral-200 bg-white p-3.5 shadow-xs space-y-1"
              >
                <h3 className="text-xs font-semibold text-neutral-950">
                  {point.headline}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {point.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Compensation, Training & Exposure */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 border-b border-neutral-200 pb-2">
            5. Compensation, Training &amp; Growth
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {job.compensationAndTraining}
          </p>
          {job.salaryText && (
            <div className="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700">
              <strong className="font-semibold text-neutral-900">Compensation Framework: </strong>
              {job.salaryText}
            </div>
          )}
        </section>

        {/* Application Interactive Section */}
        <ApplySection job={job} />

        {/* Back Link */}
        <div className="pt-4 border-t border-neutral-200">
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-700 hover:text-black transition-colors inline-flex items-center gap-1"
          >
            <span aria-hidden="true">←</span> Back to all open positions
          </Link>
        </div>
      </div>
    </>
  );
}
