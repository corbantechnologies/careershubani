import Link from "next/link";
import { JobPosting } from "@/types/job";

interface JobCardProps {
  job: JobPosting;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="group relative flex flex-col justify-between border border-neutral-200 rounded bg-white p-5 shadow-xs hover:border-neutral-400 hover:shadow transition-all">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 border border-neutral-200">
            {job.department}
          </span>
          <span className="rounded bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
            {job.location.type} ({job.location.city ? `${job.location.city}, ` : ""}{job.location.country})
          </span>
          <span className="rounded bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
            {job.employmentType}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950 group-hover:underline">
            <Link href={`/jobs/${job.slug}`}>
              {job.title}
            </Link>
          </h2>
          {job.subtitle && (
            <p className="text-xs font-medium text-neutral-500 mt-0.5">
              {job.subtitle}
            </p>
          )}
        </div>

        <p className="text-sm text-neutral-700 line-clamp-2 leading-relaxed">
          {job.roleSummary}
        </p>

        <div className="pt-1 text-xs text-neutral-500 flex flex-wrap items-center gap-y-1 gap-x-3">
          <span>Target: {job.targetProfile.split("(")[0].trim()}</span>
          <span>•</span>
          <span>Deadline: {job.deadlineText}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-xs text-neutral-500">
          Posted {job.datePosted}
        </span>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-1.5 rounded bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
        >
          View Role &amp; Apply
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
