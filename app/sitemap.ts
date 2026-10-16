import type { MetadataRoute } from "next";
import { getAllJobs } from "@/lib/jobs";

export default function sitemap(): MetadataRoute.Sitemap {
  const jobs = getAllJobs();
  const baseUrl = "https://careers.hubani.org";

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.datePosted),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-10-17"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...jobEntries,
  ];
}
