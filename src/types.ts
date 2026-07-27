export type UserRole = 'Super Admin' | 'Communication Officer' | 'Department Admin' | 'Auditor';

export interface UserPermissions {
  canAdd: boolean;
  canEdit: boolean;
  canSoftDelete: boolean;
  canHardDelete: boolean;
  canManageUsers: boolean;
  canManageGlobalSettings: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  payrollNumber?: string;
  password?: string;
  role: UserRole;
  departmentIds: string[]; // e.g. ['dept-2'] for Health Services or ['*'] for all
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  permissions: UserPermissions;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  departmentId?: string;
  category: 'Press Release' | 'General' | 'Notice';
  mainImage?: string;
  gallery?: string[];
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  departmentId?: string;
  mainImage?: string;
  gallery?: string[];
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  mandate: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Official {
  id: string;
  name: string;
  role: string;
  departmentId?: string;
  type: 'Governor' | 'Deputy Governor' | 'CECM' | 'CCO';
  imagePlaceholder: string;
  profile?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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
  departmentId?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'Budget' | 'Tender' | 'Policy' | 'Report';
  datePosted: string;
  size: string;
  fileData?: string;
  departmentId?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'SOFT_DELETE' | 'RESTORE' | 'HARD_DELETE' | 'SESSION_SWITCH' | 'GLOBAL_SETTINGS_UPDATE' | 'PERMISSIONS_UPDATE';
  module: 'Departments' | 'News' | 'Events' | 'Documents' | 'Vacancies' | 'Leadership' | 'Tourism' | 'Users' | 'Emergency Alert' | 'Hero Slideshow' | 'County Branding' | 'Governor Statement' | 'System';
  details: string;
  departmentId?: string;
  ipAddress?: string;
}

