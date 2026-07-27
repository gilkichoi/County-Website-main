import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  Building, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  UserCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Image, 
  Upload, 
  BadgeCheck, 
  Shield, 
  Compass, 
  Briefcase, 
  Clock, 
  Eye, 
  Download, 
  Building2,
  RotateCcw,
  Lock,
  ShieldCheck,
  Search,
  Filter,
  Activity,
  LogOut,
  Camera,
  Link as LinkIcon
} from 'lucide-react';
import { 
  Department, 
  NewsItem, 
  EventItem, 
  Document, 
  GovernorMessage, 
  EmergencyAlert, 
  Official, 
  HeroContent, 
  CountyBranding, 
  TouristSite, 
  Vacancy 
} from '../types';
import { UserSessionBar } from '../components/UserSessionBar';
import { UsersManager } from '../components/UsersManager';
import { AuditLogsManager } from '../components/AuditLogsManager';
import { StaffOtpLogin } from '../components/StaffOtpLogin';
import { GalleryUploader } from '../components/GalleryUploader';
import { safeConfirm } from '../utils/safeConfirm';
import { 
  isSuperAdmin, 
  isCommunicationOfficer, 
  canUserAccessDepartment, 
  canUserAddContent, 
  canUserEditContent, 
  canUserSoftDelete, 
  canUserHardDelete, 
  canUserManageGlobalSettings 
} from '../utils/permissions';

function compressAndReadImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image. Please choose a PNG, JPG, or WEBP image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file from disk.'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('The uploaded file is not a valid image format.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            width = maxHeight;
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function AccessRestrictedNotice({ title = 'Global Administration Settings Restricted' }: { title?: string }) {
  return (
    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 mx-auto border border-amber-200 shadow-2xs">
        <Lock className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-gray-900 text-base">{title}</h3>
      <p className="text-xs text-amber-900 max-w-lg mx-auto leading-relaxed">
        Communication Officers are scoped strictly to managing news, events, public documents, and career vacancies for their assigned county department(s). Global branding, hero slideshows, and emergency banners require <strong>Super Administrator</strong> authority.
      </p>
      <p className="text-[11px] text-gray-500 italic">
        Tip: Use the "Switch Active Session" bar at the top to log in as a Super Admin to modify global settings.
      </p>
    </div>
  );
}

export function AdminDashboard() {
  const { currentUser, setCurrentUser, newsItems, eventItems, vacancies, auditLogs, allSystemUsers } = useData();
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('taita_taveta_staff_authenticated') === 'true';
  });

  const [activeTab, setActiveTab] = useState<
    'users' | 'audit' | 'departments' | 'news' | 'events' | 'documents' | 'vacancies' | 'governor' | 'alert' | 'slideshow' | 'leadership' | 'logo' | 'tourism'
  >('users');

  const canManageGlobal = canUserManageGlobalSettings(currentUser);

  if (!isStaffAuthenticated) {
    return (
      <div className="py-6">
        <StaffOtpLogin
          onAuthenticated={(user) => {
            setCurrentUser(user);
            setIsStaffAuthenticated(true);
            localStorage.setItem('taita_taveta_staff_authenticated', 'true');
          }}
        />
      </div>
    );
  }

  const handleLockSession = () => {
    setIsStaffAuthenticated(false);
    localStorage.removeItem('taita_taveta_staff_authenticated');
  };

  const activeNewsCount = newsItems.filter(n => !n.deleted).length;
  const activeEventsCount = eventItems.filter(e => !e.deleted).length;
  const activeVacanciesCount = vacancies.filter(v => v.status === 'Open').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Authenticated Staff Security Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 text-white p-3.5 sm:px-5 rounded-2xl mb-6 shadow-md border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
          <span className="font-bold text-slate-300">Staff Portal Session Active:</span>
          <span className="font-extrabold text-emerald-300">{currentUser.name}</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-md text-[10px] font-black uppercase tracking-wider">
            {currentUser.role}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-bold border border-slate-700">
            2FA OTP Authenticated
          </span>
        </div>

        <button
          onClick={handleLockSession}
          className="inline-flex items-center px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all border border-red-500/30 shadow-xs shrink-0"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          Lock Portal / Sign Out
        </button>
      </div>

      {/* Quick KPI Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Published News</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">{activeNewsCount}</span>
          </div>
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Upcoming Events</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">{activeEventsCount}</span>
          </div>
          <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Open Careers</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">{activeVacanciesCount}</span>
          </div>
          <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Audit Log Entries</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">{auditLogs.length}</span>
          </div>
          <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* User Session Bar Switcher */}
      <UserSessionBar />

      <div className="mb-6 border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center">
            <Settings className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-green-700" />
            County Content & Administration Control Panel
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Role-Based Access Control (RBAC) portal for managing department vacancies, news, events, documents, and system officers.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              icon={<ShieldCheck className="w-5 h-5 mr-3 text-purple-600" />} 
              label="Users & Role Management" 
            />
            <TabButton 
              active={activeTab === 'audit'} 
              onClick={() => setActiveTab('audit')} 
              icon={<Activity className="w-5 h-5 mr-3 text-orange-600" />} 
              label="Audit Logs & History" 
            />
            <TabButton 
              active={activeTab === 'vacancies'} 
              onClick={() => setActiveTab('vacancies')} 
              icon={<Briefcase className="w-5 h-5 mr-3 text-emerald-700" />} 
              label="Careers & Vacancies" 
            />
            <TabButton 
              active={activeTab === 'news'} 
              onClick={() => setActiveTab('news')} 
              icon={<FileText className="w-5 h-5 mr-3 text-blue-600" />} 
              label="County News" 
            />
            <TabButton 
              active={activeTab === 'events'} 
              onClick={() => setActiveTab('events')} 
              icon={<Calendar className="w-5 h-5 mr-3 text-indigo-600" />} 
              label="County Events" 
            />
            <TabButton 
              active={activeTab === 'documents'} 
              onClick={() => setActiveTab('documents')} 
              icon={<FileText className="w-5 h-5 mr-3 text-amber-600" />} 
              label="Official Documents" 
            />
            <TabButton 
              active={activeTab === 'departments'} 
              onClick={() => setActiveTab('departments')} 
              icon={<Building className="w-5 h-5 mr-3 text-teal-600" />} 
              label="County Departments" 
            />
            <TabButton 
              active={activeTab === 'leadership'} 
              onClick={() => setActiveTab('leadership')} 
              icon={<Users className="w-5 h-5 mr-3 text-blue-700" />} 
              label="CECMs & CCOs Leadership" 
            />
            <TabButton 
              active={activeTab === 'tourism'} 
              onClick={() => setActiveTab('tourism')} 
              icon={<Compass className="w-5 h-5 mr-3 text-emerald-600" />} 
              label="Tourism Destinations" 
            />

            <div className="pt-3 pb-1 border-t border-gray-200 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">
              Global County Settings
            </div>

            <TabButton 
              active={activeTab === 'alert'} 
              onClick={() => setActiveTab('alert')} 
              icon={<ShieldAlert className="w-5 h-5 mr-3 text-red-600" />} 
              label="Emergency Alerts" 
            />
            <TabButton 
              active={activeTab === 'slideshow'} 
              onClick={() => setActiveTab('slideshow')} 
              icon={<Image className="w-5 h-5 mr-3 text-green-700" />} 
              label="Hero Slideshow" 
            />
            <TabButton 
              active={activeTab === 'logo'} 
              onClick={() => setActiveTab('logo')} 
              icon={<Shield className="w-5 h-5 mr-3 text-yellow-600" />} 
              label="Logo & Branding" 
            />
            <TabButton 
              active={activeTab === 'governor'} 
              onClick={() => setActiveTab('governor')} 
              icon={<UserCheck className="w-5 h-5 mr-3 text-cyan-600" />} 
              label="Governor Statement" 
            />
          </nav>
        </aside>

        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
          {activeTab === 'users' && <UsersManager />}
          {activeTab === 'audit' && <AuditLogsManager />}
          {activeTab === 'departments' && <DepartmentsManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'events' && <EventsManager />}
          {activeTab === 'documents' && <DocumentsManager />}
          {activeTab === 'vacancies' && <VacanciesManager />}
          {activeTab === 'leadership' && <LeadershipManager />}
          {activeTab === 'tourism' && <TourismManager />}


          {/* Global Settings (Super Admin Only) */}
          {activeTab === 'alert' && (canManageGlobal ? <EmergencyAlertManager /> : <AccessRestrictedNotice title="Emergency Alerts Configuration Restricted" />)}
          {activeTab === 'slideshow' && (canManageGlobal ? <SlideshowManager /> : <AccessRestrictedNotice title="Hero Slideshow Configuration Restricted" />)}
          {activeTab === 'logo' && (canManageGlobal ? <CountyLogoManager /> : <AccessRestrictedNotice title="County Logo & Branding Restricted" />)}
          {activeTab === 'governor' && (canManageGlobal ? <GovernorMessageManager /> : <AccessRestrictedNotice title="Governor Statement Restricted" />)}
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
        active 
          ? 'bg-green-700 text-white shadow-xs' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* =========================================================================
   DEPARTMENTS MANAGER (Active & Soft Delete Trash Bin + Department Scoped)
   ========================================================================= */
function DepartmentsManager() {
  const { allDepartments, saveDepartment, deleteDepartment, restoreDepartment, hardDeleteDepartment, currentUser } = useData();
  const [editing, setEditing] = useState<Partial<Department> | null>(null);
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeDepts = allDepartments.filter(d => !d.deleted);
  const trashedDepts = allDepartments.filter(d => d.deleted);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.name && editing.description && editing.mandate) {
      saveDepartment({
        id: editing.id || `dept-${Date.now()}`,
        name: editing.name,
        description: editing.description,
        mandate: editing.mandate
      });
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">County Departments</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage executive departments, mandates, and overview summaries.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button
            onClick={() => setEditing({})}
            className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Department
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setViewTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-green-800 shadow-xs' : 'text-gray-600'}`}
        >
          Active Departments ({activeDepts.length})
        </button>
        <button
          onClick={() => setViewTab('trash')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Trash Bin ({trashedDepts.length})
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">{editing.id ? 'Edit' : 'Add'} Department</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Department Name *</label>
              <input required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Overview Description *</label>
              <textarea required value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none" rows={2} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Mandate *</label>
              <textarea required value={editing.mandate || ''} onChange={e => setEditing({...editing, mandate: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none" rows={2} />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 border rounded-xl text-xs font-bold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-green-700 text-white rounded-xl text-xs font-bold">Save Department</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Department Name</th>
              <th className="px-6 py-3 text-left">Mandate Overview</th>
              {viewTab === 'trash' && <th className="px-6 py-3 text-left">Deleted By / Date</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(viewTab === 'active' ? activeDepts : trashedDepts).map(dept => {
              const canAccess = canUserAccessDepartment(currentUser, dept.id);

              return (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {dept.name}
                    {!canAccess && (
                      <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                        Outside Scope
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 line-clamp-2 max-w-md">{dept.mandate}</td>
                  
                  {viewTab === 'trash' && (
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      <span>{dept.deletedBy || 'System'}</span>
                      <span className="block text-[10px] text-gray-400">{dept.deletedAt}</span>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    {viewTab === 'active' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={!canAccess || !canUserEditContent(currentUser)}
                          onClick={() => setEditing(dept)}
                          className={`p-1.5 rounded-lg font-bold text-xs ${
                            canAccess ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title={canAccess ? 'Edit Department' : 'You do not have access to this department'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={!canAccess || !canUserSoftDelete(currentUser)}
                          onClick={() => {
                            if (safeConfirm(`Soft delete department "${dept.name}"?`)) {
                              deleteDepartment(dept.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg font-bold text-xs ${
                            canAccess ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => restoreDepartment(dept.id)}
                          className="px-2.5 py-1 bg-green-50 text-green-800 hover:bg-green-100 rounded-lg font-bold text-[11px] flex items-center"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> Restore
                        </button>
                        {isSuperAdmin(currentUser) && (
                          <button
                            onClick={() => {
                              if (safeConfirm(`Permanently delete department "${dept.name}"?`)) {
                                hardDeleteDepartment(dept.id);
                              }
                            }}
                            className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold text-[11px]"
                          >
                            Hard Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {(viewTab === 'active' ? activeDepts : trashedDepts).length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  {viewTab === 'active' ? 'No departments found.' : 'Trash bin is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   NEWS MANAGER (Active & Soft Delete Trash Bin + Department Scoped)
   ========================================================================= */
function NewsManager() {
  const { allNewsItems, saveNewsItem, deleteNewsItem, restoreNewsItem, hardDeleteNewsItem, departments, currentUser } = useData();
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeItems = allNewsItems.filter(n => !n.deleted);
  const trashedItems = allNewsItems.filter(n => n.deleted);

  const getDeptName = (id?: string) => {
    if (!id) return 'General County';
    const d = departments.find(dept => dept.id === id);
    return d ? d.name : id;
  };

  const handleStartAdd = () => {
    const defaultDept = isCommunicationOfficer(currentUser) && currentUser.departmentIds[0] !== '*' 
      ? currentUser.departmentIds[0] 
      : undefined;

    setEditing({ category: 'General', departmentId: defaultDept, date: new Date().toISOString().split('T')[0] });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.title && editing.summary && editing.category) {
      saveNewsItem({
        id: editing.id || `news-${Date.now()}`,
        title: editing.title,
        summary: editing.summary,
        category: editing.category as any,
        date: editing.date || new Date().toISOString().split('T')[0],
        departmentId: editing.departmentId || undefined,
        mainImage: editing.mainImage,
        gallery: editing.gallery
      });
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">County Press Releases & News</h2>
          <p className="text-xs text-gray-500 mt-0.5">Publish official news bulletins and press notices for assigned departments.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button onClick={handleStartAdd} className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Publish New News
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setViewTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-green-800 shadow-xs' : 'text-gray-600'}`}
        >
          Active News ({activeItems.length})
        </button>
        <button
          onClick={() => setViewTab('trash')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Trash Bin ({trashedItems.length})
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">{editing.id ? 'Edit' : 'Publish'} News Item</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Headline Title *</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Article Summary *</label>
              <textarea required value={editing.summary || ''} onChange={e => setEditing({...editing, summary: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500" rows={2} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category *</label>
                <select value={editing.category || 'General'} onChange={e => setEditing({...editing, category: e.target.value as any})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white font-semibold outline-none">
                  <option value="General">General</option>
                  <option value="Press Release">Press Release</option>
                  <option value="Notice">Official Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Publication Date *</label>
                <input type="date" required value={editing.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Department</label>
                <select 
                  value={editing.departmentId || ''} 
                  disabled={isCommunicationOfficer(currentUser) && currentUser.departmentIds.length === 1 && currentUser.departmentIds[0] !== '*'}
                  onChange={e => setEditing({...editing, departmentId: e.target.value || undefined})} 
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white font-semibold outline-none"
                >
                  <option value="">General County Administration</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id} disabled={!canUserAccessDepartment(currentUser, d.id)}>
                      {d.name} {!canUserAccessDepartment(currentUser, d.id) ? '(Restricted)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-700">Main Article Cover Photo</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    compressAndReadImage(file).then(dataUrl => setEditing({...editing, mainImage: dataUrl}));
                  }
                }} className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-xs bg-white" />
                {editing.mainImage && (
                  <div className="relative">
                    <img src={editing.mainImage} alt="Cover" className="h-16 w-28 object-cover rounded-xl shadow-xs border" />
                    <button
                      type="button"
                      onClick={() => setEditing({...editing, mainImage: ''})}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <GalleryUploader
              gallery={editing.gallery || []}
              onChange={g => setEditing({...editing, gallery: g})}
              compressAndReadImage={compressAndReadImage}
              label="Article Photo Gallery Pictures"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 border rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-green-700 text-white rounded-xl font-bold">Save News Article</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">News Headline</th>
              <th className="px-6 py-3 text-left">Department Scope</th>
              <th className="px-6 py-3 text-left">Category & Date</th>
              {viewTab === 'trash' && <th className="px-6 py-3 text-left">Deleted By / Date</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(viewTab === 'active' ? activeItems : trashedItems).map(item => {
              const canAccess = canUserAccessDepartment(currentUser, item.departmentId);

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${canAccess ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {getDeptName(item.departmentId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="font-semibold block">{item.category}</span>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </td>

                  {viewTab === 'trash' && (
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      <span>{item.deletedBy || 'System'}</span>
                      <span className="block text-[10px] text-gray-400">{item.deletedAt}</span>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    {viewTab === 'active' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={!canAccess || !canUserEditContent(currentUser)}
                          onClick={() => setEditing(item)}
                          className={`p-1.5 rounded-lg font-bold text-xs ${
                            canAccess ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={!canAccess || !canUserSoftDelete(currentUser)}
                          onClick={() => {
                            if (safeConfirm(`Soft delete news item "${item.title}"?`)) {
                              deleteNewsItem(item.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg font-bold text-xs ${
                            canAccess ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => restoreNewsItem(item.id)} className="px-2.5 py-1 bg-green-50 text-green-800 hover:bg-green-100 rounded-lg font-bold text-[11px] flex items-center">
                          <RotateCcw className="w-3 h-3 mr-1" /> Restore
                        </button>
                        {isSuperAdmin(currentUser) && (
                          <button onClick={() => { if (safeConfirm(`Permanently hard delete "${item.title}"?`)) hardDeleteNewsItem(item.id); }} className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold text-[11px]">
                            Hard Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {(viewTab === 'active' ? activeItems : trashedItems).length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  {viewTab === 'active' ? 'No news articles posted.' : 'Trash bin is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   EVENTS MANAGER (Active & Soft Delete Trash Bin + Department Scoped)
   ========================================================================= */
function EventsManager() {
  const { allEventItems, saveEventItem, deleteEventItem, restoreEventItem, hardDeleteEventItem, departments, currentUser } = useData();
  const [editing, setEditing] = useState<Partial<EventItem> | null>(null);
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeItems = allEventItems.filter(e => !e.deleted);
  const trashedItems = allEventItems.filter(e => e.deleted);

  const getDeptName = (id?: string) => {
    if (!id) return 'Countywide Event';
    const d = departments.find(dept => dept.id === id);
    return d ? d.name : id;
  };

  const handleStartAdd = () => {
    const defaultDept = isCommunicationOfficer(currentUser) && currentUser.departmentIds[0] !== '*' 
      ? currentUser.departmentIds[0] 
      : undefined;

    setEditing({ departmentId: defaultDept, date: new Date().toISOString().split('T')[0] });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.title && editing.location && editing.date) {
      saveEventItem({
        id: editing.id || `event-${Date.now()}`,
        title: editing.title,
        location: editing.location,
        date: editing.date,
        departmentId: editing.departmentId || undefined,
        mainImage: editing.mainImage,
        gallery: editing.gallery
      });
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">County Events & Assemblies</h2>
          <p className="text-xs text-gray-500 mt-0.5">Publish upcoming townhalls, public participation forums, and summits.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button onClick={handleStartAdd} className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Publish New Event
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button onClick={() => setViewTab('active')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-green-800 shadow-xs' : 'text-gray-600'}`}>
          Active Events ({activeItems.length})
        </button>
        <button onClick={() => setViewTab('trash')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Trash Bin ({trashedItems.length})
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">{editing.id ? 'Edit' : 'Create'} Event</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Event Title *</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Venue Location *</label>
                <input required value={editing.location || ''} onChange={e => setEditing({...editing, location: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none" placeholder="e.g. Mwatate Sub-County Hall" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Event Date *</label>
                <input type="date" required value={editing.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none" />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Department</label>
                <select value={editing.departmentId || ''} onChange={e => setEditing({...editing, departmentId: e.target.value || undefined})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white font-semibold outline-none">
                  <option value="">Countywide / General</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id} disabled={!canUserAccessDepartment(currentUser, d.id)}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-700">Event Poster / Cover Photo</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    compressAndReadImage(file).then(dataUrl => setEditing({...editing, mainImage: dataUrl}));
                  }
                }} className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-xs bg-white" />
                {editing.mainImage && (
                  <div className="relative">
                    <img src={editing.mainImage} alt="Cover" className="h-16 w-28 object-cover rounded-xl shadow-xs border" />
                    <button
                      type="button"
                      onClick={() => setEditing({...editing, mainImage: ''})}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <GalleryUploader
              gallery={editing.gallery || []}
              onChange={g => setEditing({...editing, gallery: g})}
              compressAndReadImage={compressAndReadImage}
              label="Event Photo Gallery Pictures"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 border rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-green-700 text-white rounded-xl font-bold">Save Event</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Event Title</th>
              <th className="px-6 py-3 text-left">Venue Location</th>
              <th className="px-6 py-3 text-left">Department & Date</th>
              {viewTab === 'trash' && <th className="px-6 py-3 text-left">Deleted By / Date</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(viewTab === 'active' ? activeItems : trashedItems).map(item => {
              const canAccess = canUserAccessDepartment(currentUser, item.departmentId);

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold block">{getDeptName(item.departmentId)}</span>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </td>

                  {viewTab === 'trash' && (
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      <span>{item.deletedBy || 'System'}</span>
                      <span className="block text-[10px] text-gray-400">{item.deletedAt}</span>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    {viewTab === 'active' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button disabled={!canAccess} onClick={() => setEditing(item)} className={`p-1.5 rounded-lg font-bold text-xs ${canAccess ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button disabled={!canAccess} onClick={() => { if (safeConfirm(`Soft delete event "${item.title}"?`)) deleteEventItem(item.id); }} className={`p-1.5 rounded-lg font-bold text-xs ${canAccess ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => restoreEventItem(item.id)} className="px-2.5 py-1 bg-green-50 text-green-800 rounded-lg font-bold text-[11px] flex items-center">
                          <RotateCcw className="w-3 h-3 mr-1" /> Restore
                        </button>
                        {isSuperAdmin(currentUser) && (
                          <button onClick={() => { if (safeConfirm(`Permanently delete "${item.title}"?`)) hardDeleteEventItem(item.id); }} className="px-2 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px]">
                            Hard Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {(viewTab === 'active' ? activeItems : trashedItems).length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  {viewTab === 'active' ? 'No events scheduled.' : 'Trash bin is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   DOCUMENTS MANAGER (Active & Soft Delete Trash Bin + Department Scoped)
   ========================================================================= */
function DocumentsManager() {
  const { allDocuments, saveDocument, deleteDocument, restoreDocument, hardDeleteDocument, departments, currentUser } = useData();
  const [editing, setEditing] = useState<Partial<Document> | null>(null);
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeItems = allDocuments.filter(d => !d.deleted);
  const trashedItems = allDocuments.filter(d => d.deleted);

  const getDeptName = (id?: string) => {
    if (!id) return 'General County';
    const d = departments.find(dept => dept.id === id);
    return d ? d.name : id;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.title && editing.type && editing.size) {
      saveDocument({
        id: editing.id || `doc-${Date.now()}`,
        title: editing.title,
        type: editing.type as any,
        size: editing.size,
        datePosted: editing.datePosted || new Date().toISOString().split('T')[0],
        departmentId: editing.departmentId || undefined,
        fileData: editing.fileData
      });
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Official Publications & Documents</h2>
          <p className="text-xs text-gray-500 mt-0.5">Upload policy bills, gazettes, budgets, and public reports.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button onClick={() => setEditing({ type: 'Policy', size: '1.5 MB', datePosted: new Date().toISOString().split('T')[0] })} className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Upload Document
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button onClick={() => setViewTab('active')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-green-800 shadow-xs' : 'text-gray-600'}`}>
          Active Documents ({activeItems.length})
        </button>
        <button onClick={() => setViewTab('trash')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Trash Bin ({trashedItems.length})
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">{editing.id ? 'Edit' : 'Upload'} Document</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Document Title *</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Classification Type *</label>
                <select value={editing.type || 'Policy'} onChange={e => setEditing({...editing, type: e.target.value as any})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white font-semibold outline-none">
                  <option value="Policy">Policy Document</option>
                  <option value="Budget">County Budget & Financial</option>
                  <option value="Tender">Tender & Procurement</option>
                  <option value="Report">Report & Audit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Department</label>
                <select value={editing.departmentId || ''} onChange={e => setEditing({...editing, departmentId: e.target.value || undefined})} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white font-semibold outline-none">
                  <option value="">General County Administration</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id} disabled={!canUserAccessDepartment(currentUser, d.id)}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">File Upload (PDF / DOC)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                    const reader = new FileReader();
                    reader.onloadend = () => setEditing({...editing, fileData: reader.result as string, size: sizeMB});
                    reader.readAsDataURL(file);
                  }
                }} className="w-full border border-gray-300 rounded-xl px-3 py-1.5 text-xs bg-white" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 border rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-green-700 text-white rounded-xl font-bold">Save Document</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Document Title</th>
              <th className="px-6 py-3 text-left">Classification</th>
              <th className="px-6 py-3 text-left">Department</th>
              {viewTab === 'trash' && <th className="px-6 py-3 text-left">Deleted By / Date</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(viewTab === 'active' ? activeItems : trashedItems).map(item => {
              const canAccess = canUserAccessDepartment(currentUser, item.departmentId);

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">{item.title}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{item.type} ({item.size})</td>
                  <td className="px-6 py-4 font-semibold text-emerald-800">{getDeptName(item.departmentId)}</td>

                  {viewTab === 'trash' && (
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      <span>{item.deletedBy || 'System'}</span>
                      <span className="block text-[10px] text-gray-400">{item.deletedAt}</span>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    {viewTab === 'active' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button disabled={!canAccess} onClick={() => setEditing(item)} className={`p-1.5 rounded-lg font-bold text-xs ${canAccess ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button disabled={!canAccess} onClick={() => { if (safeConfirm(`Soft delete document "${item.title}"?`)) deleteDocument(item.id); }} className={`p-1.5 rounded-lg font-bold text-xs ${canAccess ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => restoreDocument(item.id)} className="px-2.5 py-1 bg-green-50 text-green-800 rounded-lg font-bold text-[11px] flex items-center">
                          <RotateCcw className="w-3 h-3 mr-1" /> Restore
                        </button>
                        {isSuperAdmin(currentUser) && (
                          <button onClick={() => { if (safeConfirm(`Permanently delete "${item.title}"?`)) hardDeleteDocument(item.id); }} className="px-2 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px]">
                            Hard Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {(viewTab === 'active' ? activeItems : trashedItems).length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  {viewTab === 'active' ? 'No documents published.' : 'Trash bin is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   VACANCIES MANAGER (Active & Soft Delete Trash Bin + Department Scoped)
   ========================================================================= */
function VacanciesManager() {
  const { allVacancies, saveVacancy, deleteVacancy, restoreVacancy, hardDeleteVacancy, departments, currentUser } = useData();
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeVacancies = allVacancies.filter(v => !v.deleted);
  const trashedVacancies = allVacancies.filter(v => v.deleted);

  const emptyVacancy: Vacancy = {
    id: `vac-${Date.now()}`,
    title: '',
    departmentId: isCommunicationOfficer(currentUser) && currentUser.departmentIds[0] !== '*' ? currentUser.departmentIds[0] : (departments[0]?.id || ''),
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    type: 'Full-time',
    description: '',
    requirements: [],
    positionsCount: 1,
    fileData: '',
    fileSize: '1.2 MB',
    viewsCount: 0,
    downloadsCount: 0,
    datePosted: new Date().toISOString().split('T')[0]
  };

  const handleCreateNew = () => {
    setEditingVacancy(emptyVacancy);
    setIsCreating(true);
  };

  const handleEdit = (vac: Vacancy) => {
    setEditingVacancy({ ...vac });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVacancy) return;
    saveVacancy(editingVacancy);
    setEditingVacancy(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Careers & Public Job Vacancies</h2>
          <p className="text-xs text-gray-500 mt-0.5">Publish job postings, application deadlines, PDFs, and view application click metrics.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button onClick={handleCreateNew} className="flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Post New Job Vacancy
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button onClick={() => setViewTab('active')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600'}`}>
          Active Vacancies ({activeVacancies.length})
        </button>
        <button onClick={() => setViewTab('trash')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Trash Bin ({trashedVacancies.length})
        </button>
      </div>

      {editingVacancy && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">{isCreating ? 'Post New Job Vacancy' : 'Edit Job Vacancy'}</h3>
            <button type="button" onClick={() => setEditingVacancy(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Job Designation Title *</label>
              <input required value={editingVacancy.title} onChange={e => setEditingVacancy({...editingVacancy, title: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Senior Medical Officer" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Department *</label>
              <select value={editingVacancy.departmentId} onChange={e => setEditingVacancy({...editingVacancy, departmentId: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white font-semibold outline-none">
                {departments.map(d => (
                  <option key={d.id} value={d.id} disabled={!canUserAccessDepartment(currentUser, d.id)}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Employment Type</label>
              <select value={editingVacancy.type} onChange={e => setEditingVacancy({...editingVacancy, type: e.target.value as any})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none font-semibold">
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Application Deadline Date *</label>
              <input type="date" required value={editingVacancy.deadline} onChange={e => setEditingVacancy({...editingVacancy, deadline: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none font-bold text-emerald-800" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Number of Positions</label>
              <input type="number" min={1} value={editingVacancy.positionsCount || 1} onChange={e => setEditingVacancy({...editingVacancy, positionsCount: parseInt(e.target.value) || 1})} className="w-full border rounded-xl px-3 py-2 bg-white font-bold outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Vacancy Description Overview</label>
            <textarea rows={2} value={editingVacancy.description || ''} onChange={e => setEditingVacancy({...editingVacancy, description: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white outline-none" placeholder="Key summary of the role..." />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">PDF Advertisement File Upload</label>
            <input type="file" accept=".pdf" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setEditingVacancy({...editingVacancy, fileData: reader.result as string, fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB'});
                reader.readAsDataURL(file);
              }
            }} className="w-full border rounded-xl px-3 py-1.5 text-xs bg-white" />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setEditingVacancy(null)} className="px-3 py-1.5 border rounded-xl font-bold">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-emerald-700 text-white rounded-xl font-bold">Save Job Posting</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Vacancy Title</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Deadline & Views</th>
              {viewTab === 'trash' && <th className="px-6 py-3 text-left">Deleted By / Date</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(viewTab === 'active' ? activeVacancies : trashedVacancies).map(vac => {
              const canAccess = canUserAccessDepartment(currentUser, vac.departmentId);
              const dept = departments.find(d => d.id === vac.departmentId);

              return (
                <tr key={vac.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">{vac.title}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-800">{dept?.name || vac.departmentId}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 block">Deadline: {vac.deadline}</span>
                    <span className="text-[10px] text-gray-400">👀 {vac.viewsCount || 0} Views • 📥 {vac.downloadsCount || 0} Downloads</span>
                  </td>

                  {viewTab === 'trash' && (
                    <td className="px-6 py-4 text-gray-500 text-[11px]">
                      <span>{vac.deletedBy || 'System'}</span>
                      <span className="block text-[10px] text-gray-400">{vac.deletedAt}</span>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                    {viewTab === 'active' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button disabled={!canAccess} onClick={() => handleEdit(vac)} className={`p-1.5 rounded-lg font-bold text-xs ${canAccess ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button disabled={!canAccess} onClick={() => { if (safeConfirm(`Soft delete vacancy "${vac.title}"?`)) deleteVacancy(vac.id); }} className={`p-1.5 rounded-lg font-bold text-xs ${canAccess ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => restoreVacancy(vac.id)} className="px-2.5 py-1 bg-green-50 text-green-800 rounded-lg font-bold text-[11px] flex items-center">
                          <RotateCcw className="w-3 h-3 mr-1" /> Restore
                        </button>
                        {isSuperAdmin(currentUser) && (
                          <button onClick={() => { if (safeConfirm(`Permanently delete vacancy "${vac.title}"?`)) hardDeleteVacancy(vac.id); }} className="px-2 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px]">
                            Hard Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {(viewTab === 'active' ? activeVacancies : trashedVacancies).length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  {viewTab === 'active' ? 'No vacancies posted.' : 'Trash bin is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   LEADERSHIP MANAGER
   ========================================================================= */
function LeadershipManager() {
  const { allOfficials, saveOfficial, deleteOfficial, restoreOfficial, hardDeleteOfficial, departments, currentUser } = useData();
  const [editing, setEditing] = useState<Partial<Official> | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeOfficials = allOfficials.filter(o => !o.deleted);
  const trashedOfficials = allOfficials.filter(o => o.deleted);

  const displayedList = (viewTab === 'active' ? activeOfficials : trashedOfficials).filter(o => {
    if (filterType === 'All') return true;
    return o.type === filterType;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.name && editing.role) {
      saveOfficial({
        id: editing.id || `off-${Date.now()}`,
        name: editing.name,
        role: editing.role,
        type: editing.type || 'CECM',
        departmentId: editing.departmentId,
        imagePlaceholder: editing.imagePlaceholder || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        profile: editing.profile
      });
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">County Leadership (CECMs & CCOs)</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage CECMs, Chief Officers, and Executive portfolios.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button onClick={() => setEditing({ type: 'CECM' })} className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Add New Official
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button onClick={() => setViewTab('active')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-green-800 shadow-xs' : 'text-gray-600'}`}>
          Active Officials ({activeOfficials.length})
        </button>
        <button onClick={() => setViewTab('trash')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Trash Bin ({trashedOfficials.length})
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">{editing.id ? 'Edit' : 'Add'} Official</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Name *</label>
              <input required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" placeholder="e.g. Hon. John Doe" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Role Title *</label>
              <input required value={editing.role || ''} onChange={e => setEditing({...editing, role: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" placeholder="e.g. CECM - Health Services" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Leadership Type</label>
              <select value={editing.type || 'CECM'} onChange={e => setEditing({...editing, type: e.target.value as any})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none font-bold">
                <option value="CECM">CECM (Executive Committee Member)</option>
                <option value="CCO">CCO (Chief Officer)</option>
                <option value="Governor">Governor</option>
                <option value="Deputy Governor">Deputy Governor</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Assigned Department</label>
              <select value={editing.departmentId || ''} onChange={e => setEditing({...editing, departmentId: e.target.value || undefined})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none">
                <option value="">Executive / General</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 border rounded-xl font-bold">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-green-700 text-white rounded-xl font-bold">Save Official</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedList.map(off => {
          const canAccess = canUserAccessDepartment(currentUser, off.departmentId);

          return (
            <div key={off.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <img src={off.imagePlaceholder || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'} alt={off.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{off.name}</h4>
                  <p className="text-xs text-green-800 font-semibold">{off.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">
                    {off.type}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                {viewTab === 'active' ? (
                  <>
                    <button disabled={!canAccess} onClick={() => setEditing(off)} className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold">Edit</button>
                    <button disabled={!canAccess} onClick={() => { if (safeConfirm(`Soft delete official "${off.name}"?`)) deleteOfficial(off.id); }} className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold">Delete</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => restoreOfficial(off.id)} className="px-2.5 py-1 bg-green-50 text-green-800 hover:bg-green-100 rounded-lg text-xs font-bold flex items-center">
                      <RotateCcw className="w-3 h-3 mr-1" /> Restore
                    </button>
                    {isSuperAdmin(currentUser) && (
                      <button onClick={() => { if (safeConfirm(`Hard delete "${off.name}"?`)) hardDeleteOfficial(off.id); }} className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold">Hard Delete</button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   TOURISM MANAGER
   ========================================================================= */
function TourismManager() {
  const { allTouristSites, saveTouristSite, deleteTouristSite, restoreTouristSite, hardDeleteTouristSite, currentUser } = useData();
  const [editingSite, setEditingSite] = useState<TouristSite | null>(null);
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  const activeSites = allTouristSites.filter(t => !t.deleted);
  const trashedSites = allTouristSites.filter(t => t.deleted);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSite && editingSite.name && editingSite.description) {
      saveTouristSite(editingSite);
      setEditingSite(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tourism Destinations</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage Tsavo National Park, Lake Jipe, Vuria Hills, and historical sites.</p>
        </div>

        {canUserAddContent(currentUser) && (
          <button onClick={() => setEditingSite({ id: `site-${Date.now()}`, name: '', description: '', location: 'Taita Taveta County', imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80' })} className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Add Tourist Site
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
        <button onClick={() => setViewTab('active')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewTab === 'active' ? 'bg-white text-green-800 shadow-xs' : 'text-gray-600'}`}>
          Active Destinations ({activeSites.length})
        </button>
        <button onClick={() => setViewTab('trash')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center ${viewTab === 'trash' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-gray-500'}`}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Trash Bin ({trashedSites.length})
        </button>
      </div>

      {editingSite && (
        <form onSubmit={handleSave} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-sm">Edit Destination</h3>
            <button type="button" onClick={() => setEditingSite(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Destination Name *</label>
              <input required value={editingSite.name} onChange={e => setEditingSite({...editingSite, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Location Sub-County</label>
              <input required value={editingSite.location} onChange={e => setEditingSite({...editingSite, location: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Description *</label>
            <textarea rows={3} required value={editingSite.description} onChange={e => setEditingSite({...editingSite, description: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white outline-none" />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setEditingSite(null)} className="px-3 py-1.5 border rounded-xl font-bold">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-green-700 text-white rounded-xl font-bold">Save Destination</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(viewTab === 'active' ? activeSites : trashedSites).map(site => (
          <div key={site.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-start space-x-3">
              <img src={site.imageUrl || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80'} alt={site.name} className="w-20 h-20 rounded-xl object-cover border shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-gray-900">{site.name}</h4>
                <p className="text-xs text-green-800 font-semibold">{site.location}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{site.description}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
              {viewTab === 'active' ? (
                <>
                  <button onClick={() => setEditingSite(site)} className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold">Edit</button>
                  <button onClick={() => { if (safeConfirm(`Soft delete destination "${site.name}"?`)) deleteTouristSite(site.id); }} className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold">Delete</button>
                </>
              ) : (
                <>
                  <button onClick={() => restoreTouristSite(site.id)} className="px-2.5 py-1 bg-green-50 text-green-800 hover:bg-green-100 rounded-lg text-xs font-bold flex items-center">
                    <RotateCcw className="w-3 h-3 mr-1" /> Restore
                  </button>
                  {isSuperAdmin(currentUser) && (
                    <button onClick={() => { if (safeConfirm(`Hard delete "${site.name}"?`)) hardDeleteTouristSite(site.id); }} className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold">Hard Delete</button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   GLOBAL SETTINGS MANAGERS (EMERGENCY ALERTS, SLIDESHOW, LOGO, GOVERNOR)
   ========================================================================= */
function EmergencyAlertManager() {
  const { emergencyAlert, saveEmergencyAlert } = useData();
  const [formData, setFormData] = useState<EmergencyAlert>(emergencyAlert);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmergencyAlert(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggle = (enabled: boolean) => {
    const updated = { ...formData, enabled };
    setFormData(updated);
    saveEmergencyAlert(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShieldAlert className="w-6 h-6 mr-2 text-red-600" /> Emergency Alert Banner Configuration
          </h2>
          <p className="text-xs text-gray-500 mt-1">Broadcast live safety advisories and emergency public notices across all portal pages.</p>
        </div>

        <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shrink-0">
          <span className="text-xs font-bold text-gray-700">Banner Status:</span>
          <button
            type="button"
            onClick={() => handleToggle(!formData.enabled)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formData.enabled ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-black uppercase ${formData.enabled ? 'text-red-600' : 'text-gray-400'}`}>
            {formData.enabled ? 'LIVE ACTIVE' : 'OFF'}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
          Emergency Alert settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Alert Severity Level</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full border rounded-xl px-3 py-2 bg-white font-bold outline-none"
            >
              <option value="danger">Danger / Critical (Red)</option>
              <option value="warning">Warning / Advisory (Amber)</option>
              <option value="info">Notice / Announcement (Blue)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Banner Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 bg-white outline-none"
              placeholder="e.g. HEAVY RAINFALL ADVISORY"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Alert Message *</label>
          <textarea
            required
            rows={3}
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className="w-full border rounded-xl p-2.5 bg-white outline-none"
            placeholder="Detailed alert message..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs">
            Save Alert Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

function SlideshowManager() {
  const { heroContent, saveHeroContent } = useData();
  const [formData, setFormData] = useState<HeroContent>({
    welcomeTag: heroContent?.welcomeTag || 'Datoni ya Rika • Welcome to Taita Taveta',
    title: heroContent?.title || 'The Land of Endless Potential & Rich Heritage',
    titleColor: heroContent?.titleColor || 'text-white',
    subtitle: heroContent?.subtitle || 'Official portal for the County Government of Taita Taveta.',
    slides: heroContent?.slides || [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80',
      'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1600&q=80'
    ]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveHeroContent(formData);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Homepage Hero Slideshow</h2>
        <p className="text-xs text-gray-500 mt-0.5">Customize welcoming headline, tagline, and background image slides.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Welcome Tagline</label>
          <input value={formData.welcomeTag} onChange={e => setFormData({...formData, welcomeTag: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Main Hero Headline</label>
          <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
          <textarea rows={2} value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white outline-none" />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 bg-green-700 text-white font-bold rounded-xl shadow-xs">
            Save Slideshow Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function CountyLogoManager() {
  const { countyBranding, saveCountyBranding } = useData();
  const [editingBranding, setEditingBranding] = useState<CountyBranding>(countyBranding);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCountyBranding(editingBranding);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">County Coat of Arms & Branding</h2>
        <p className="text-xs text-gray-500 mt-0.5">Update official county seal, portal title, and motto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Official County Title</label>
          <input value={editingBranding.countyTitle} onChange={e => setEditingBranding({...editingBranding, countyTitle: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none font-bold" />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">County Motto</label>
          <input value={editingBranding.countySubtitle} onChange={e => setEditingBranding({...editingBranding, countySubtitle: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 bg-green-700 text-white font-bold rounded-xl shadow-xs">
            Save Branding Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

function GovernorMessageManager() {
  const { governorMessage, saveGovernorMessage } = useData();
  const [editing, setEditing] = useState<GovernorMessage>(governorMessage);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [photoUrlTemp, setPhotoUrlTemp] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveGovernorMessage(editing);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndReadImage(file).then(dataUrl => setEditing({ ...editing, imageUrl: dataUrl }));
    }
  };

  const handleAddPhotoUrl = () => {
    if (photoUrlTemp.trim()) {
      setEditing({ ...editing, imageUrl: photoUrlTemp.trim() });
      setPhotoUrlTemp('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Message from H.E. The Governor</h2>
        <p className="text-xs text-gray-500 mt-0.5">Update the executive address, official title, and governor photograph.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200 text-xs">
        {/* Governor Photograph Section */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
          <label className="block font-bold text-gray-800 text-xs flex items-center">
            <Camera className="w-4 h-4 mr-1.5 text-emerald-700" />
            Governor Official Portrait Picture
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              {editing.imageUrl ? (
                <img
                  src={editing.imageUrl}
                  alt={editing.name}
                  className="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-emerald-600/30"
                />
              ) : (
                <div className="w-28 h-36 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                  <UserCheck className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold">No Photo</span>
                </div>
              )}

              {editing.imageUrl && (
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, imageUrl: '' })}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                  title="Remove Photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              <p className="text-gray-500 leading-relaxed text-[11px]">
                Upload an official high-resolution photograph of His Excellency The Governor. Recommended size: 600x800px or higher.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Photo File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="inline-flex items-center px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors border border-gray-200"
                >
                  <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                  {showUrlInput ? 'Hide URL Input' : 'Add Image URL'}
                </button>
              </div>

              {showUrlInput && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={photoUrlTemp}
                    onChange={e => setPhotoUrlTemp(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-xl font-bold"
                  >
                    Set URL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Governor Full Name *</label>
            <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none font-bold text-gray-900" />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Title Designation *</label>
            <input required value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border rounded-xl px-3 py-2 bg-white outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Welcome Address Message *</label>
          <textarea required rows={6} value={editing.message} onChange={e => setEditing({...editing, message: e.target.value})} className="w-full border rounded-xl p-3 bg-white outline-none leading-relaxed" />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-xs transition-colors">
            Save Governor Statement
          </button>
        </div>
      </form>
    </div>
  );
}
