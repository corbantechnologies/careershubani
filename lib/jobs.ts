import jobsData from "@/data/jobs.json";
import { JobPosting } from "@/types/job";

export function getAllJobs(): JobPosting[] {
  return (jobsData as JobPosting[]).filter((job) => job.status === "active");
}

export function getJobBySlug(slug: string): JobPosting | undefined {
  return (jobsData as JobPosting[]).find(
    (job) => job.slug === slug && job.status === "active"
  );
}

export function getAllDepartments(): string[] {
  const jobs = getAllJobs();
  const set = new Set(jobs.map((j) => j.department));
  return Array.from(set);
}
