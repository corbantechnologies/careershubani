import { JobPosting } from "@/types/job";

interface JobSchemaProps {
  job: JobPosting;
}

export default function JobSchema({ job }: JobSchemaProps) {
  // Build clean HTML formatted description for Google Jobs
  const descriptionHtml = `
    <p><strong>About Hubani Limited:</strong> ${job.aboutCompany}</p>
    <p><strong>Role Overview:</strong> ${job.roleSummary}</p>
    ${job.extendedSummary ? `<p>${job.extendedSummary}</p>` : ""}
    
    <h3>Key Responsibilities:</h3>
    ${job.responsibilityGroups
      .map(
        (group) => `
        <h4>${group.category}</h4>
        <ul>
          ${group.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `
      )
      .join("")}

    <h3>Candidate Profile & Mindset:</h3>
    <p>${job.candidateProfileIntro}</p>
    <ul>
      ${job.candidateProfilePoints
        .map((p) => `<li><strong>${p.headline}:</strong> ${p.detail}</li>`)
        .join("")}
    </ul>

    <h3>Compensation & Mentorship:</h3>
    <p>${job.compensationAndTraining}</p>
  `;

  // Build JSON-LD object adhering to Schema.org JobPosting specification
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: `${job.title} (${job.subtitle || ""})`.trim(),
    description: descriptionHtml,
    identifier: {
      "@type": "PropertyValue",
      name: "Hubani Limited",
      value: job.id,
    },
    datePosted: job.datePosted,
    employmentType: job.schemaEmploymentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "Hubani Limited",
      sameAs: "https://hubani.org",
      logo: "https://hubani.org/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.city || "Mombasa",
        addressRegion: "Coast",
        addressCountry: "KE",
      },
    },
  };

  // Support remote / telecommute indexing
  if (job.location.type === "Remote" || job.location.type === "Hybrid") {
    jsonLd.jobLocationType = "TELECOMMUTE";
    jsonLd.applicantLocationRequirements = {
      "@type": "Country",
      name: "Kenya",
    };
  }

  // Only include baseSalary if structured salary is explicitly provided
  if (job.salary?.currency && (job.salary.minValue || job.salary.maxValue)) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salary.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary.minValue,
        maxValue: job.salary.maxValue,
        unitText: job.salary.unitText,
      },
    };
  }

  if (job.validThrough) {
    jsonLd.validThrough = job.validThrough;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
