import { getAllJobs, getAllDepartments } from "@/lib/jobs";
import JobCard from "@/components/JobCard";
import Link from "next/link";

export default function Home() {
  const jobs = getAllJobs();
  const departments = getAllDepartments();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 space-y-16">
      {/* Hero Section */}
      <section className="space-y-4 border-b border-neutral-200 pb-10">
        <div className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Now Hiring: Early-Career &amp; Executive Positions</span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-xl">
          Build High-Impact Ventures with Hubani Limited
        </h1>

        <p className="max-w-3xl text-sm leading-relaxed text-neutral-700">
          Hubani Limited is an agile parent holding corporation operating across
          premium cinematic music publishing, advanced data telemetry systems,
          and international tournament administration (governing entity of{" "}
          <strong className="font-semibold text-black">BOTYA</strong>). We build
          lean, technology-driven teams led by young directors who champion
          autonomy, speed, and continuous growth.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pt-2 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-900">Base:</span> Mombasa, Kenya &amp; Remote Workspaces
          </span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-900">Culture:</span> Direct Mentorship &amp; High Autonomy
          </span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-900">Philosophy:</span> Potential Above Traditional Tenure
          </span>
        </div>
      </section>

      {/* Open Opportunities Section */}
      <section id="positions" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Open Opportunities
            </h2>
            <p className="text-xs text-neutral-600">
              {jobs.length} position{jobs.length === 1 ? "" : "s"} currently accepting applications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-neutral-500">Departments:</span>
            {departments.map((dept) => (
              <span
                key={dept}
                className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-neutral-800"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded border border-neutral-200 p-8 text-center text-sm text-neutral-600">
            No active positions at this time. Check back soon or email{" "}
            <a href="mailto:careers@hubani.org" className="underline font-medium text-black">
              careers@hubani.org
            </a>
            .
          </div>
        )}
      </section>

      {/* Culture & Working at Hubani */}
      <section className="space-y-6 rounded border border-neutral-200 bg-neutral-50/40 p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
            Why Work &amp; Grow With Us
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            We intentionally reject bloated corporate bureaucracy in favor of rapid development.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded border border-neutral-200 bg-white p-4 shadow-xs space-y-1.5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Mentorship From Leadership
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Work side-by-side with young directors. Receive hands-on guidance, legal blueprints, and executive operational frameworks.
            </p>
          </div>

          <div className="rounded border border-neutral-200 bg-white p-4 shadow-xs space-y-1.5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Students &amp; Early Talent Welcome
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We value curiosity, trainability, and discipline above decades of resume credentials. We actively hire students and recent graduates.
            </p>
          </div>

          <div className="rounded border border-neutral-200 bg-white p-4 shadow-xs space-y-1.5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Global Multi-Disciplinary Exposure
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Contribute across international verticals, from the global BOTYA tournament league to digital telemetry software and music IP.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-neutral-200 pt-4 gap-3 text-xs text-neutral-600">
          <span>General inquiries or future opportunities:</span>
          <a
            href="mailto:careers@hubani.org"
            className="rounded bg-black px-3 py-1.5 font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Contact Recruitment: careers@hubani.org
          </a>
        </div>
      </section>
    </div>
  );
}
