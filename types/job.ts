export interface JobLocation {
  type: "Remote" | "Hybrid" | "On-site";
  city?: string;
  country: string;
  workplaceAddress?: string;
}

export interface JobResponsibilityGroup {
  category: string;
  items: string[];
}

export interface JobProfileRequirement {
  headline: string;
  detail: string;
}

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  department: string;
  reportingLine: string;
  targetProfile: string;
  engagementFramework: string;
  location: JobLocation;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Retained";
  schemaEmploymentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN" | "OTHER";
  datePosted: string; // ISO format: YYYY-MM-DD
  validThrough?: string; // Optional deadline or rolling
  deadlineText: string;
  salaryText?: string; // Optional human-readable compensation
  salary?: {
    currency: string;
    minValue?: number;
    maxValue?: number;
    unitText: "MONTH" | "YEAR";
  };
  aboutCompany: string;
  roleSummary: string;
  extendedSummary?: string;
  responsibilityGroups: JobResponsibilityGroup[];
  candidateProfileIntro: string;
  candidateProfilePoints: JobProfileRequirement[];
  compensationAndTraining: string;
  applicationEmail: string;
  applicationInstructions: string;
  status: "active" | "closed" | "draft";
}
