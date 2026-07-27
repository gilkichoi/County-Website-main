export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  departmentId?: string;
  category: 'Press Release' | 'General' | 'Notice';
  mainImage?: string;
  gallery?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  departmentId?: string;
  mainImage?: string;
  gallery?: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  mandate: string;
}

export interface Official {
  id: string;
  name: string;
  role: string;
  departmentId?: string;
  type: 'Governor' | 'Deputy Governor' | 'CECM' | 'CCO';
  imagePlaceholder: string;
}

export interface TouristSite {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'Budget' | 'Tender' | 'Policy' | 'Report';
  datePosted: string;
  size: string;
  fileData?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  departmentId: string;
  deadline: string;
  type: 'Full-time' | 'Contract' | 'Internship';
}

export interface GovernorMessage {
  id: string;
  name: string;
  title: string;
  message: string;
  imageUrl: string;
}

export interface EmergencyAlert {
  enabled: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  linkUrl?: string;
  linkText?: string;
}

