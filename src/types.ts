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
  profile?: string;
}

export interface HeroActionButton {
  id: string;
  label: string;
  url: string;
  color: 'green' | 'orange' | 'gold' | 'dark' | 'white';
}

export interface HeroContent {
  welcomeTag: string;
  title: string;
  titleColor?: 'text-white' | 'text-orange-400' | 'text-amber-300' | 'text-green-400';
  subtitle: string;
  slides: string[];
  actionButtons?: HeroActionButton[];
}

export interface CountyBranding {
  logoUrl?: string;
  countyName: string;
  countyTagline: string;
  motto?: string;
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
  departmentIds?: string[];
  deadline: string;
  type: 'Full-time' | 'Contract' | 'Internship' | 'Part-time' | 'Temporary';
  referenceNo?: string;
  description?: string;
  requirements?: string[];
  positionsCount?: number;
  fileData?: string;
  fileSize?: string;
  viewsCount?: number;
  downloadsCount?: number;
  datePosted?: string;
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

