export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
}

export interface Summary {
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Skills {
  items: string[];
}

export interface ProjectsItem {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface CvContent {
  personalInfo: PersonalInfo;
  summary: Summary;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Skills;
  projects: ProjectsItem[];
}
