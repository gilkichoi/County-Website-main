import { SystemUser, UserRole } from '../types';

export function isSuperAdmin(user?: SystemUser | null): boolean {
  if (!user) return false;
  return user.role === 'Super Admin' || user.departmentIds.includes('*');
}

export function isCommunicationOfficer(user?: SystemUser | null): boolean {
  if (!user) return false;
  return user.role === 'Communication Officer';
}

export function isDepartmentAdmin(user?: SystemUser | null): boolean {
  if (!user) return false;
  return user.role === 'Department Admin';
}

export function isAuditor(user?: SystemUser | null): boolean {
  if (!user) return false;
  return user.role === 'Auditor';
}

export function canUserAccessDepartment(user?: SystemUser | null, departmentId?: string): boolean {
  if (!user || user.status !== 'Active') return false;
  if (isSuperAdmin(user)) return true;
  if (!departmentId) return isSuperAdmin(user);
  return user.departmentIds.includes(departmentId);
}

export function canUserAddContent(user?: SystemUser | null, departmentId?: string): boolean {
  if (!user || user.status !== 'Active') return false;
  if (!user.permissions.canAdd) return false;
  if (!departmentId) return isSuperAdmin(user);
  return canUserAccessDepartment(user, departmentId);
}

export function canUserEditContent(user?: SystemUser | null, departmentId?: string): boolean {
  if (!user || user.status !== 'Active') return false;
  if (!user.permissions.canEdit) return false;
  if (!departmentId) return isSuperAdmin(user);
  return canUserAccessDepartment(user, departmentId);
}

export function canUserSoftDelete(user?: SystemUser | null, departmentId?: string): boolean {
  if (!user || user.status !== 'Active') return false;
  if (!user.permissions.canSoftDelete) return false;
  if (!departmentId) return isSuperAdmin(user);
  return canUserAccessDepartment(user, departmentId);
}

export function canUserHardDelete(user?: SystemUser | null): boolean {
  if (!user || user.status !== 'Active') return false;
  return user.permissions.canHardDelete && isSuperAdmin(user);
}

export function canUserManageUsers(user?: SystemUser | null): boolean {
  if (!user || user.status !== 'Active') return false;
  return user.permissions.canManageUsers && isSuperAdmin(user);
}

export function canUserManageGlobalSettings(user?: SystemUser | null): boolean {
  if (!user || user.status !== 'Active') return false;
  return user.permissions.canManageGlobalSettings && isSuperAdmin(user);
}

export function getAccessibleDepartmentIds(user?: SystemUser | null, allDepartmentIds: string[] = []): string[] {
  if (!user || user.status !== 'Active') return [];
  if (isSuperAdmin(user)) return allDepartmentIds;
  return user.departmentIds.filter(id => id !== '*');
}
