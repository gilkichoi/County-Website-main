import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Users, FileText, Calendar, Building, Plus, Trash2, Edit2, X, UserCheck, AlertTriangle, ShieldAlert, CheckCircle2, Image, Upload, BadgeCheck, Shield, Compass, Briefcase, Clock, Eye, Download, Building2 } from 'lucide-react';
import { Department, NewsItem, EventItem, Document, GovernorMessage, EmergencyAlert, Official, HeroContent, CountyBranding, TouristSite, Vacancy } from '../types';

function safeConfirm(msg: string): boolean {
  try {
    return window.confirm(msg);
  } catch {
    return true;
  }
}

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
            height = maxHeight;
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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'departments' | 'news' | 'events' | 'documents' | 'vacancies' | 'governor' | 'alert' | 'slideshow' | 'leadership' | 'logo' | 'tourism'>('alert');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-green-700" />
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">Manage slideshow, CECMs & CCOs leadership, tourism sites, county logo, emergency alerts, departments, news, events, documents, and careers/vacancies.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <TabButton 
              active={activeTab === 'alert'} 
              onClick={() => setActiveTab('alert')} 
              icon={<ShieldAlert className="w-5 h-5 mr-3 text-red-600" />} 
              label="Emergency Alert" 
            />
            <TabButton 
              active={activeTab === 'slideshow'} 
              onClick={() => setActiveTab('slideshow')} 
              icon={<Image className="w-5 h-5 mr-3 text-green-700" />} 
              label="Slideshow & Hero" 
            />
            <TabButton 
              active={activeTab === 'vacancies'} 
              onClick={() => setActiveTab('vacancies')} 
              icon={<Briefcase className="w-5 h-5 mr-3 text-emerald-700" />} 
              label="Careers & Vacancies" 
            />
            <TabButton 
              active={activeTab === 'leadership'} 
              onClick={() => setActiveTab('leadership')} 
              icon={<Users className="w-5 h-5 mr-3 text-blue-600" />} 
              label="CECMs & CCOs Leadership" 
            />
            <TabButton 
              active={activeTab === 'tourism'} 
              onClick={() => setActiveTab('tourism')} 
              icon={<Compass className="w-5 h-5 mr-3 text-emerald-600" />} 
              label="Tourism Sites" 
            />
            <TabButton 
              active={activeTab === 'logo'} 
              onClick={() => setActiveTab('logo')} 
              icon={<Shield className="w-5 h-5 mr-3 text-yellow-600" />} 
              label="County Logo & Branding" 
            />
            <TabButton 
              active={activeTab === 'governor'} 
              onClick={() => setActiveTab('governor')} 
              icon={<UserCheck className="w-5 h-5 mr-3" />} 
              label="Governor Message" 
            />
            <TabButton 
              active={activeTab === 'departments'} 
              onClick={() => setActiveTab('departments')} 
              icon={<Building className="w-5 h-5 mr-3" />} 
              label="Departments" 
            />
            <TabButton 
              active={activeTab === 'news'} 
              onClick={() => setActiveTab('news')} 
              icon={<FileText className="w-5 h-5 mr-3" />} 
              label="News" 
            />
            <TabButton 
              active={activeTab === 'events'} 
              onClick={() => setActiveTab('events')} 
              icon={<Calendar className="w-5 h-5 mr-3" />} 
              label="Events" 
            />
            <TabButton 
              active={activeTab === 'documents'} 
              onClick={() => setActiveTab('documents')} 
              icon={<FileText className="w-5 h-5 mr-3" />} 
              label="Documents" 
            />
          </nav>
        </aside>

        <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
          {activeTab === 'alert' && <EmergencyAlertManager />}
          {activeTab === 'slideshow' && <SlideshowManager />}
          {activeTab === 'vacancies' && <VacanciesManager />}
          {activeTab === 'leadership' && <LeadershipManager />}
          {activeTab === 'tourism' && <TourismManager />}
          {activeTab === 'logo' && <CountyLogoManager />}
          {activeTab === 'governor' && <GovernorMessageManager />}
          {activeTab === 'departments' && <DepartmentsManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'events' && <EventsManager />}
          {activeTab === 'documents' && <DocumentsManager />}
        </main>
      </div>
    </div>
  );
}


function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'bg-green-50 text-green-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DepartmentsManager() {
  const { departments, saveDepartment, deleteDepartment } = useData();
  const [editing, setEditing] = useState<Partial<Department> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.name && editing.description && editing.mandate) {
      saveDepartment({
        id: editing.id || Date.now().toString(),
        name: editing.name,
        description: editing.description,
        mandate: editing.mandate
      });
      setEditing(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Departments</h2>
        <button onClick={() => setEditing({})} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{editing.id ? 'Edit' : 'Add'} Department</h3>
            <button type="button" onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mandate</label>
              <textarea required value={editing.mandate || ''} onChange={e => setEditing({...editing, mandate: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map(dept => (
              <tr key={dept.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditing(dept)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if(safeConfirm('Are you sure?')) deleteDepartment(dept.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewsManager() {
  const { newsItems, saveNewsItem, deleteNewsItem, departments } = useData();
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.title && editing.summary && editing.category) {
      saveNewsItem({
        id: editing.id || Date.now().toString(),
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">News Items</h2>
        <button onClick={() => setEditing({ category: 'General' })} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" /> Add News
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{editing.id ? 'Edit' : 'Add'} News</h3>
            <button type="button" onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
              <textarea required value={editing.summary || ''} onChange={e => setEditing({...editing, summary: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={editing.category || 'General'} onChange={e => setEditing({...editing, category: e.target.value as any})} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="General">General</option>
                  <option value="Press Release">Press Release</option>
                  <option value="Notice">Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" required value={editing.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department (Optional)</label>
              <select value={editing.departmentId || ''} onChange={e => setEditing({...editing, departmentId: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">None (General)</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image (Upload)</label>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEditing({...editing, mainImage: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              {editing.mainImage && <img src={editing.mainImage} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded shadow-sm" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (Upload multiple)</label>
              <input type="file" accept="image/*" multiple onChange={e => {
                const files = Array.from(e.target.files || []) as File[];
                const promises = files.map((file: File) => {
                  return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                  });
                });
                Promise.all(promises).then(results => {
                  setEditing({...editing, gallery: [...(editing.gallery || []), ...results]});
                });
              }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              {editing.gallery && editing.gallery.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto py-2">
                  {editing.gallery.map((img, i) => (
                    <div key={i} className="relative shrink-0">
                      <img src={img} alt={`Gallery ${i}`} className="h-16 w-16 object-cover rounded shadow-sm" />
                      <button type="button" onClick={() => setEditing({...editing, gallery: editing.gallery?.filter((_, index) => index !== i)})} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditing(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if(safeConfirm('Are you sure?')) deleteNewsItem(item.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventsManager() {
  const { eventItems, saveEventItem, deleteEventItem, departments } = useData();
  const [editing, setEditing] = useState<Partial<EventItem> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.title && editing.location && editing.date) {
      saveEventItem({
        id: editing.id || Date.now().toString(),
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Events</h2>
        <button onClick={() => setEditing({})} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{editing.id ? 'Edit' : 'Add'} Event</h3>
            <button type="button" onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required value={editing.location || ''} onChange={e => setEditing({...editing, location: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" required value={editing.date || ''} onChange={e => setEditing({...editing, date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department (Optional)</label>
              <select value={editing.departmentId || ''} onChange={e => setEditing({...editing, departmentId: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">None (General)</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image (Upload)</label>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEditing({...editing, mainImage: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              {editing.mainImage && <img src={editing.mainImage} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded shadow-sm" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (Upload multiple)</label>
              <input type="file" accept="image/*" multiple onChange={e => {
                const files = Array.from(e.target.files || []) as File[];
                const promises = files.map((file: File) => {
                  return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                  });
                });
                Promise.all(promises).then(results => {
                  setEditing({...editing, gallery: [...(editing.gallery || []), ...results]});
                });
              }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              {editing.gallery && editing.gallery.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto py-2">
                  {editing.gallery.map((img, i) => (
                    <div key={i} className="relative shrink-0">
                      <img src={img} alt={`Gallery ${i}`} className="h-16 w-16 object-cover rounded shadow-sm" />
                      <button type="button" onClick={() => setEditing({...editing, gallery: editing.gallery?.filter((_, index) => index !== i)})} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditing(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if(safeConfirm('Are you sure?')) deleteEventItem(item.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentsManager() {
  const { documents, saveDocument, deleteDocument } = useData();
  const [editing, setEditing] = useState<Partial<Document> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.title && editing.type && editing.size) {
      saveDocument({
        id: editing.id || Date.now().toString(),
        title: editing.title,
        type: editing.type as any,
        size: editing.size,
        datePosted: editing.datePosted || new Date().toISOString().split('T')[0],
        fileData: editing.fileData
      });
      setEditing(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Documents</h2>
        <button onClick={() => setEditing({ type: 'Policy', size: '1 MB' })} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" /> Add Document
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{editing.id ? 'Edit' : 'Add'} Document</h3>
            <button type="button" onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={editing.type || 'Policy'} onChange={e => setEditing({...editing, type: e.target.value as any})} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="Policy">Policy</option>
                  <option value="Budget">Budget</option>
                  <option value="Tender">Tender</option>
                  <option value="Report">Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (Generates size)</label>
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditing({...editing, fileData: reader.result as string, size: sizeInMB});
                    };
                    reader.readAsDataURL(file);
                  }
                }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
            </div>
            {editing.size && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input required value={editing.size || ''} onChange={e => setEditing({...editing, size: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
              </div>
            )}
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditing(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if(safeConfirm('Are you sure?')) deleteDocument(item.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function GovernorMessageManager() {
  const { governorMessage, saveGovernorMessage } = useData();
  const [editing, setEditing] = useState<Partial<GovernorMessage> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.name && editing.title && editing.message && editing.imageUrl) {
      saveGovernorMessage({
        id: 'gov-msg',
        name: editing.name,
        title: editing.title,
        message: editing.message,
        imageUrl: editing.imageUrl,
      });
      setEditing(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Message from the Governor</h2>
        {editing === null && (
          <button onClick={() => setEditing(governorMessage)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Message
          </button>
        )}
      </div>

      {editing !== null ? (
        <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Edit Message</h3>
            <button type="button" onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required value={editing.message || ''} onChange={e => setEditing({...editing, message: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 h-32" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Governor Image (Upload)</label>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEditing({...editing, imageUrl: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              {editing.imageUrl && <img src={editing.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded shadow-sm" />}
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <img src={governorMessage.imageUrl} alt={governorMessage.name} className="w-32 h-32 object-cover rounded-lg shadow-sm" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{governorMessage.name}</h3>
            <p className="text-green-700 font-medium mb-4">{governorMessage.title}</p>
            <p className="text-gray-700 leading-relaxed">{governorMessage.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" /> Emergency Alert Banner Configuration
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Broadcast urgent safety advisories, weather warnings, or public health notices live across all site pages.
          </p>
        </div>

        {/* Live Status Switch */}
        <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shrink-0">
          <span className="text-xs font-bold text-gray-700">Banner Status:</span>
          <button
            type="button"
            onClick={() => handleToggle(!formData.enabled)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formData.enabled ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-bold ${formData.enabled ? 'text-red-600' : 'text-gray-400'}`}>
            {formData.enabled ? 'LIVE ON SITE' : 'OFF'}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" /> Alert configuration updated successfully!
        </div>
      )}

      {/* Live Preview Card */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Live Preview:</label>
        <div
          className={`p-4 rounded-xl border text-white shadow-sm transition-colors ${
            formData.enabled
              ? formData.type === 'danger'
                ? 'bg-gradient-to-r from-red-700 to-rose-700 border-red-800'
                : formData.type === 'warning'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 border-amber-700'
                : 'bg-gradient-to-r from-blue-700 to-indigo-700 border-blue-800'
              : 'bg-gray-100 text-gray-400 border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/20 text-white">
                  {formData.type.toUpperCase()} ALERT
                </span>
                <h4 className="font-bold text-sm leading-snug">{formData.title || 'Untitled Emergency'}</h4>
                <p className="text-xs opacity-90 mt-0.5">{formData.message || 'No alert description provided.'}</p>
              </div>
            </div>
            {formData.linkText && (
              <span className="px-3 py-1 bg-white text-gray-900 rounded font-bold text-xs shrink-0">
                {formData.linkText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Alert Severity Level</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="danger">Danger / Critical (Red)</option>
              <option value="warning">Warning / Advisory (Amber)</option>
              <option value="info">Notice / Announcement (Blue)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Banner Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. HEAVY RAINFALL ADVISORY"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Alert Description / Instructions</label>
          <textarea
            required
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Detailed alert instructions or emergency phone contacts..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Action Link URL (Optional)</label>
            <input
              type="text"
              value={formData.linkUrl || ''}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="/news or https://disaster.taitataveta.go.ke"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Button Label (Optional)</label>
            <input
              type="text"
              value={formData.linkText || ''}
              onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. View Safety Instructions"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Save Alert Configuration
          </button>

          <button
            type="button"
            onClick={() => handleToggle(false)}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-bold text-xs"
          >
            Turn Off Alert Banner
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
    subtitle: heroContent?.subtitle || 'Official portal for the County Government of Taita Taveta. Access public services, discover investment opportunities, and explore our majestic tourist destinations.',
    slides: heroContent?.slides || [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80',
      'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1600&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80'
    ],
    actionButtons: heroContent?.actionButtons || [
      { id: 'btn_1', label: 'Our Government', url: '/about', color: 'green' },
      { id: 'btn_2', label: 'Explore Tourism', url: '/tourism', color: 'orange' }
    ]
  });
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const compressedDataUrl = await compressAndReadImage(file, 1600, 1000, 0.75);
      setFormData(prev => ({
        ...prev,
        slides: [...prev.slides, compressedDataUrl]
      }));
    } catch (err: any) {
      console.error("Slideshow image upload error:", err);
      setUploadError(err?.message || "Failed to process image file. Please try another image.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddSlideUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlideUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        slides: [...prev.slides, newSlideUrl.trim()]
      }));
      setNewSlideUrl('');
    }
  };

  const handleRemoveSlide = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
  };

  const handleAddButton = () => {
    const newBtn = {
      id: `btn_${Date.now()}`,
      label: 'New Action',
      url: '/about',
      color: (formData.actionButtons && formData.actionButtons.length % 2 === 1 ? 'orange' : 'green') as 'green' | 'orange' | 'gold' | 'dark' | 'white'
    };
    setFormData(prev => ({
      ...prev,
      actionButtons: [...(prev.actionButtons || []), newBtn]
    }));
  };

  const handleUpdateButton = (id: string, updatedFields: Partial<NonNullable<HeroContent['actionButtons']>[0]>) => {
    setFormData(prev => ({
      ...prev,
      actionButtons: (prev.actionButtons || []).map(b => b.id === id ? { ...b, ...updatedFields } : b)
    }));
  };

  const handleRemoveButton = (id: string) => {
    setFormData(prev => ({
      ...prev,
      actionButtons: (prev.actionButtons || []).filter(b => b.id !== id)
    }));
  };

  const handleMoveButton = (index: number, direction: 'up' | 'down') => {
    const buttons = [...(formData.actionButtons || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= buttons.length) return;
    const temp = buttons[index];
    buttons[index] = buttons[targetIdx];
    buttons[targetIdx] = temp;
    setFormData(prev => ({ ...prev, actionButtons: buttons }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveHeroContent(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Homepage Slideshow & Hero Message</h2>
          <p className="text-sm text-gray-500">Customize background slideshow images and hero message text.</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Messaging & Title Color */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-5">
          <h3 className="font-bold text-gray-900 text-base flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-700" /> Hero Headline & Text Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Welcome Tagline / Badge</label>
              <input
                type="text"
                required
                value={formData.welcomeTag}
                onChange={e => setFormData({ ...formData, welcomeTag: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. Datoni ya Rika • Welcome to Taita Taveta"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Main Hero Title Headline</label>
                <textarea
                  required
                  rows={2}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. The Land of Endless Potential & Rich Heritage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title Text Color</label>
                <select
                  value={formData.titleColor || 'text-white'}
                  onChange={e => setFormData({ ...formData, titleColor: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none font-bold"
                >
                  <option value="text-white">⚪ Crisp White</option>
                  <option value="text-orange-400">🟧 Official County Orange</option>
                  <option value="text-amber-300">🟨 County Gold / Yellow</option>
                  <option value="text-green-400">🟩 Official County Green</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle Description</label>
              <textarea
                required
                rows={2}
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Brief portal statement..."
              />
            </div>
          </div>
        </div>

        {/* Hero Action Buttons Manager */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-600" /> Hero Call-to-Action Buttons ({formData.actionButtons?.length || 0})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Customize button labels, destination links, and interchange between official green and orange themes.</p>
            </div>
            <button
              type="button"
              onClick={handleAddButton}
              className="inline-flex items-center px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Button
            </button>
          </div>

          <div className="space-y-3">
            {(formData.actionButtons || []).map((btn, index) => (
              <div key={btn.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                  <span>#{index + 1}</span>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveButton(index, 'up')}
                      className="hover:text-gray-900 disabled:opacity-20"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === (formData.actionButtons?.length || 0) - 1}
                      onClick={() => handleMoveButton(index, 'down')}
                      className="hover:text-gray-900 disabled:opacity-20"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      required
                      value={btn.label}
                      onChange={e => handleUpdateButton(btn.id, { label: e.target.value })}
                      placeholder="e.g. Our Government"
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Target Link / URL</label>
                    <input
                      type="text"
                      required
                      value={btn.url}
                      onChange={e => handleUpdateButton(btn.id, { url: e.target.value })}
                      placeholder="e.g. /about or /tourism"
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Theme Color</label>
                    <select
                      value={btn.color}
                      onChange={e => handleUpdateButton(btn.id, { color: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none font-bold"
                    >
                      <option value="green">🟩 Official Green</option>
                      <option value="orange">🟧 Official Orange</option>
                      <option value="gold">🟨 County Gold</option>
                      <option value="dark">⬛ Charcoal / Dark</option>
                      <option value="white">⬜ White / Glass</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(btn.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {(!formData.actionButtons || formData.actionButtons.length === 0) && (
              <div className="p-4 text-center text-xs text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                No custom buttons configured. Click "Add Button" to create hero action buttons.
              </div>
            )}
          </div>
        </div>

        {/* Slideshow Images */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <Image className="w-5 h-5 mr-2 text-green-700" /> Slideshow Images ({formData.slides.length})
            </h3>
            
            <label className={`cursor-pointer inline-flex items-center px-4 py-2 ${
              isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
            } text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0`}>
              <Upload className={`w-4 h-4 mr-2 ${isUploading ? 'animate-spin' : ''}`} />
              {isUploading ? 'Compressing & Adding...' : 'Upload Image File'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                disabled={isUploading} 
                className="hidden" 
              />
            </label>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center justify-between">
              <span>{uploadError}</span>
              <button type="button" onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700 ml-2 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSlideUrl}
              onChange={e => setNewSlideUrl(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddSlideUrl}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl"
            >
              Add Slide URL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.slides.map((slideUrl, index) => (
              <div key={index} className="relative group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={slideUrl} alt={`Slide ${index + 1}`} className="w-full h-40 object-cover" />
                <div className="p-3 flex items-center justify-between bg-white">
                  <span className="text-xs font-semibold text-gray-700">Slide #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
        >
          Save Slideshow & Hero Content
        </button>
      </form>
    </div>
  );
}

function LeadershipManager() {
  const { officials, departments, saveOfficial, deleteOfficial } = useData();
  const [filterType, setFilterType] = useState<string>('All');
  const [editing, setEditing] = useState<Partial<Official> | null>(null);

  const filteredOfficials = officials.filter(o => {
    if (filterType === 'All') return true;
    return o.type === filterType;
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editing) {
      try {
        const compressedDataUrl = await compressAndReadImage(file, 800, 800, 0.75);
        setEditing(prev => prev ? ({ ...prev, imagePlaceholder: compressedDataUrl }) : null);
      } catch (err) {
        console.error("Leadership image processing failed:", err);
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && editing.name && editing.role && editing.type) {
      saveOfficial({
        id: editing.id || `off-${Date.now()}`,
        name: editing.name,
        role: editing.role,
        type: editing.type as any,
        departmentId: editing.departmentId || undefined,
        imagePlaceholder: editing.imagePlaceholder || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        profile: editing.profile || ''
      });
      setEditing(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">County Leadership (CECMs & CCOs)</h2>
          <p className="text-sm text-gray-500">Manage names, roles, departments, profiles, and images for executive members.</p>
        </div>
        <button
          onClick={() => setEditing({ type: 'CECM', imagePlaceholder: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' })}
          className="flex items-center px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Official
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
        {['All', 'CECM', 'CCO', 'Governor', 'Deputy Governor'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === type ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type === 'All' ? 'All Leadership' : type}
          </button>
        ))}
      </div>

      {/* Form Modal/Box */}
      {editing !== null && (
        <form onSubmit={handleSave} className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 text-base">{editing.id ? 'Edit Official' : 'Add New Official'}</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Name</label>
              <input
                required
                type="text"
                value={editing.name || ''}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. Hon. John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Leadership Type</label>
              <select
                value={editing.type || 'CECM'}
                onChange={e => setEditing({ ...editing, type: e.target.value as any })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="CECM">CECM (Executive Committee Member)</option>
                <option value="CCO">CCO (Chief Officer)</option>
                <option value="Governor">Governor</option>
                <option value="Deputy Governor">Deputy Governor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Role / Position Title</label>
              <input
                required
                type="text"
                value={editing.role || ''}
                onChange={e => setEditing({ ...editing, role: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. CECM - Health Services"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Department</label>
              <select
                value={editing.departmentId || ''}
                onChange={e => setEditing({ ...editing, departmentId: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">-- None / Executive --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Profile Biography / Statement</label>
            <textarea
              rows={3}
              value={editing.profile || ''}
              onChange={e => setEditing({ ...editing, profile: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Brief biography or statement regarding their portfolio..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Official Photo</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {editing.imagePlaceholder && (
                <img
                  src={editing.imagePlaceholder}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-600 shadow-sm shrink-0"
                />
              )}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={editing.imagePlaceholder || ''}
                  onChange={e => setEditing({ ...editing, imagePlaceholder: e.target.value })}
                  placeholder="Paste Image URL (https://...)"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white outline-none"
                />
                <label className="inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Photo File
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold"
            >
              Save Official
            </button>
          </div>
        </form>
      )}

      {/* Officials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOfficials.map(official => (
          <div key={official.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start space-x-4 shadow-sm hover:shadow-md transition-shadow">
            <img
              src={official.imagePlaceholder}
              alt={official.name}
              className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 uppercase tracking-wider">
                  {official.type}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditing(official)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (safeConfirm(`Remove ${official.name}?`)) deleteOfficial(official.id); }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm mt-1 truncate">{official.name}</h3>
              <p className="text-xs text-green-700 font-medium truncate">{official.role}</p>
              {official.profile && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{official.profile}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountyLogoManager() {
  const { countyBranding, saveCountyBranding } = useData();
  const [formData, setFormData] = useState<CountyBranding>({
    logoUrl: countyBranding?.logoUrl || '',
    countyName: countyBranding?.countyName || 'Taita Taveta',
    countyTagline: countyBranding?.countyTagline || 'County Government',
    motto: countyBranding?.motto || 'Datoni ya Rika'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressAndReadImage(file, 600, 600, 0.8);
        setFormData(prev => ({ ...prev, logoUrl: compressedDataUrl }));
      } catch (err) {
        console.error("Logo image processing failed:", err);
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCountyBranding(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Website County Logo & Branding</h2>
          <p className="text-sm text-gray-500">Upload official county logo/coat of arms and edit header identity.</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Saved successfully!
          </div>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="mb-8 bg-gray-900 p-6 rounded-2xl text-white">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Live Header Branding Preview</span>
        <div className="bg-white rounded-xl p-4 flex items-center space-x-3 max-w-sm text-gray-900">
          {formData.logoUrl ? (
            <img src={formData.logoUrl} alt="County Logo" className="w-12 h-12 object-contain rounded p-0.5 border border-gray-200 bg-white" />
          ) : (
            <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-yellow-500">
              TT
            </div>
          )}
          <div>
            <h1 className="font-bold text-xl leading-tight">{formData.countyName || 'Taita Taveta'}</h1>
            <p className="text-xs text-green-700 font-semibold tracking-wider uppercase">{formData.countyTagline || 'County Government'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Website County Logo Image</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white shrink-0 overflow-hidden">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo preview" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-1">Default Seal</span>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              <input
                type="text"
                value={formData.logoUrl || ''}
                onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="Enter Logo Image URL (https://...)"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              />
              <div className="flex gap-2">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo File
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: '' })}
                    className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200"
                  >
                    Reset to Default Seal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">County Name</label>
            <input
              type="text"
              required
              value={formData.countyName}
              onChange={e => setFormData({ ...formData, countyName: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">County Subtitle / Tagline</label>
            <input
              type="text"
              required
              value={formData.countyTagline}
              onChange={e => setFormData({ ...formData, countyTagline: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">County Motto</label>
          <input
            type="text"
            value={formData.motto || ''}
            onChange={e => setFormData({ ...formData, motto: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="e.g. Datoni ya Rika"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
        >
          Save Website Logo & Branding
        </button>
      </form>
    </div>
  );
}

function TourismManager() {
  const { touristSites, saveTouristSite, deleteTouristSite } = useData();
  const [editingSite, setEditingSite] = useState<TouristSite | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleStartAdd = () => {
    setEditingSite({
      id: `site_${Date.now()}`,
      name: '',
      location: '',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
      description: ''
    });
    setIsCreating(true);
    setSaveSuccess(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSite) return;

    setIsProcessingImage(true);
    try {
      const dataUrl = await compressAndReadImage(file, 1200, 800, 0.75);
      setEditingSite(prev => prev ? ({ ...prev, imageUrl: dataUrl }) : null);
    } catch (err) {
      console.error("Tourism image upload error:", err);
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;
    saveTouristSite(editingSite);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setEditingSite(null);
    setIsCreating(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Compass className="w-5 h-5 mr-2 text-green-700" />
            Tourism Sites & Attractions Manager
          </h2>
          <p className="text-xs text-gray-500 mt-1">Add, edit, or delete tourist destinations, parks, and attractions in the county.</p>
        </div>
        <button
          type="button"
          onClick={handleStartAdd}
          className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Tourist Site
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
          Tourist site successfully saved and updated!
        </div>
      )}

      {editingSite && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <h3 className="font-bold text-sm text-gray-900">
              {isCreating ? 'Add New Tourist Destination' : `Edit: ${editingSite.name}`}
            </h3>
            <button
              type="button"
              onClick={() => setEditingSite(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Site / Destination Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tsavo East & West National Parks"
                  value={editingSite.name}
                  onChange={e => setEditingSite({ ...editingSite, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sub-County / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Voi / Taveta Sub-Counties"
                  value={editingSite.location}
                  onChange={e => setEditingSite({ ...editingSite, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Destination Image</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-28 h-20 rounded-xl bg-gray-200 overflow-hidden border border-gray-300 shrink-0">
                  {editingSite.imageUrl ? (
                    <img src={editingSite.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Image className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter image URL or upload image file below"
                    value={editingSite.imageUrl}
                    onChange={e => setEditingSite({ ...editingSite, imageUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <div>
                    <label className="inline-flex items-center px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer border border-gray-300 shadow-sm transition-colors">
                      <Upload className={`w-3.5 h-3.5 mr-1.5 ${isProcessingImage ? 'animate-spin' : ''}`} />
                      {isProcessingImage ? 'Compressing...' : 'Upload Image File'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isProcessingImage} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description & Key Highlights *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe the wildlife, scenic landscapes, or cultural experience..."
                value={editingSite.description}
                onChange={e => setEditingSite({ ...editingSite, description: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingSite(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Save Tourist Site
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {touristSites.map((site) => (
          <div key={site.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between p-4">
            <div className="flex items-start space-x-4">
              <img
                src={site.imageUrl || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80'}
                alt={site.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 bg-green-50 text-green-800 font-bold text-[10px] uppercase rounded-md mb-1">
                  {site.location}
                </span>
                <h3 className="font-bold text-sm text-gray-900 truncate">{site.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{site.description}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditingSite(site);
                  setIsCreating(false);
                }}
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (safeConfirm(`Are you sure you want to delete "${site.name}"?`)) {
                    deleteTouristSite(site.id);
                  }
                }}
                className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {touristSites.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Compass className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-600">No tourist sites added yet.</p>
            <p className="text-[11px] text-gray-400 mt-1">Click "Add Tourist Site" above to publish a destination.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VacanciesManager() {
  const { vacancies, departments, saveVacancy, deleteVacancy } = useData();
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [primaryDeptId, setPrimaryDeptId] = useState('');
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Internship' | 'Part-time' | 'Temporary'>('Full-time');
  const [deadline, setDeadline] = useState('');
  const [positionsCount, setPositionsCount] = useState(1);
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [fileData, setFileData] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'General Administration';

  const handleStartCreate = () => {
    setTitle('');
    setReferenceNo(`TTC/CPSB/2026/0${vacancies.length + 1}`);
    setPrimaryDeptId(departments[0]?.id || 'dept-1');
    setSelectedDeptIds(departments[0] ? [departments[0].id] : []);
    setJobType('Full-time');
    setDeadline('2026-08-30T17:00');
    setPositionsCount(1);
    setDescription('');
    setRequirementsText('Must be a Kenyan Citizen holding a valid National ID Card.\nBachelor degree or Diploma from a recognized institution.\nSatisfy Chapter Six of the Constitution of Kenya 2010.');
    setFileData('');
    setFileSize('');
    setFileName('');
    setEditingVacancy(null);
    setIsCreating(true);
  };

  const handleStartEdit = (vac: Vacancy) => {
    setTitle(vac.title);
    setReferenceNo(vac.referenceNo || '');
    setPrimaryDeptId(vac.departmentId);
    setSelectedDeptIds(vac.departmentIds || [vac.departmentId]);
    setJobType(vac.type);
    setDeadline(vac.deadline ? vac.deadline.replace(' ', 'T').substring(0, 16) : '');
    setPositionsCount(vac.positionsCount || 1);
    setDescription(vac.description || '');
    setRequirementsText((vac.requirements || []).join('\n'));
    setFileData(vac.fileData || '');
    setFileSize(vac.fileSize || '');
    setFileName(vac.fileData ? 'Uploaded_Document.pdf' : '');
    setEditingVacancy(vac);
    setIsCreating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const readableSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;
    
    setFileSize(readableSize);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !primaryDeptId) return;

    const reqList = requirementsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const vacancyObj: Vacancy = {
      id: editingVacancy ? editingVacancy.id : `vac-${Date.now()}`,
      title,
      referenceNo,
      departmentId: primaryDeptId,
      departmentIds: selectedDeptIds.length > 0 ? selectedDeptIds : [primaryDeptId],
      type: jobType,
      deadline,
      positionsCount,
      description,
      requirements: reqList,
      fileData: fileData || undefined,
      fileSize: fileSize || '1.2 MB',
      viewsCount: editingVacancy ? editingVacancy.viewsCount || 0 : 0,
      downloadsCount: editingVacancy ? editingVacancy.downloadsCount || 0 : 0,
      datePosted: editingVacancy ? editingVacancy.datePosted : new Date().toISOString().split('T')[0]
    };

    saveVacancy(vacancyObj);
    setIsCreating(false);
    setEditingVacancy(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-green-700" />
            Careers & Vacancies Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Upload public job vacancies, configure real-time application countdown deadlines, assign featured departments, and manage attachments.
          </p>
        </div>

        {!isCreating && !editingVacancy && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Post New Vacancy
          </button>
        )}
      </div>

      {/* Form Section */}
      {(isCreating || editingVacancy) && (
        <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-bold text-sm text-gray-900">
              {isCreating ? 'Create Job Vacancy Announcement' : `Edit Vacancy: ${editingVacancy?.title}`}
            </h3>
            <button
              onClick={() => { setIsCreating(false); setEditingVacancy(null); }}
              className="p-1 hover:bg-gray-200 rounded-lg text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Senior Medical Officer / Civil Engineer"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reference Number *</label>
                <input
                  type="text"
                  required
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  placeholder="e.g. TTC/CPSB/2026/05"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Department *</label>
                <select
                  value={primaryDeptId}
                  onChange={e => {
                    setPrimaryDeptId(e.target.value);
                    if (!selectedDeptIds.includes(e.target.value)) {
                      setSelectedDeptIds([...selectedDeptIds, e.target.value]);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-xs font-semibold focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Employment Terms *</label>
                <select
                  value={jobType}
                  onChange={e => setJobType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-xs font-semibold focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="Full-time">Full-time (Permanent)</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Number of Openings</label>
                <input
                  type="number"
                  min={1}
                  value={positionsCount}
                  onChange={e => setPositionsCount(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* Featured Departments Selection */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Featured Departments (Select all applicable)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-gray-200 max-h-36 overflow-y-auto">
                {departments.map(d => {
                  const checked = selectedDeptIds.includes(d.id);
                  return (
                    <label key={d.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedDeptIds([...selectedDeptIds, d.id]);
                          } else {
                            if (selectedDeptIds.length > 1) {
                              setSelectedDeptIds(selectedDeptIds.filter(id => id !== d.id));
                            }
                          }
                        }}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span>{d.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Application Deadline Countdown Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Application Deadline (Date & Time) *</label>
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  This date and time will power the real-time live application countdown timer on the careers portal.
                </p>
              </div>

              {/* Upload PDF Document */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Vacancy PDF Attachment</label>
                <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-gray-300">
                  <label className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    Upload PDF File
                    <input type="file" accept="application/pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <div className="min-w-0 flex-1 text-xs text-gray-600">
                    {fileName ? (
                      <span className="font-semibold truncate block text-green-800">{fileName} ({fileSize})</span>
                    ) : (
                      <span className="text-gray-400">Optional (Auto-generates official PDF if blank)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Position Summary & Duties</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Overview of the vacancy, scope of work, and key responsibilities..."
                className="w-full border border-gray-300 rounded-xl p-3 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Key Requirements & Qualifications (1 per line)</label>
              <textarea
                rows={4}
                value={requirementsText}
                onChange={e => setRequirementsText(e.target.value)}
                placeholder="Must be a Kenyan Citizen holding a valid National ID...\nBachelor degree in relevant field...\nMinimum 5 years experience..."
                className="w-full border border-gray-300 rounded-xl p-3 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none font-sans"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingVacancy(null); }}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Save & Publish Vacancy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vacancies List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ref No & Position</th>
                <th className="py-3 px-4">Featured Department(s)</th>
                <th className="py-3 px-4">Terms</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-center">Views</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {vacancies.map(vac => {
                const featuredDeptIds = vac.departmentIds && vac.departmentIds.length > 0 ? vac.departmentIds : [vac.departmentId];
                const isExpired = new Date(vac.deadline).getTime() < new Date().getTime();

                return (
                  <tr key={vac.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] text-orange-700 font-bold block">{vac.referenceNo || 'TTC/CPSB/2026/00'}</span>
                      <strong className="text-gray-900 font-bold block text-sm">{vac.title}</strong>
                      <span className="text-[11px] text-gray-400">{vac.positionsCount || 1} position(s)</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {featuredDeptIds.map(dId => (
                          <span key={dId} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
                            {getDeptName(dId)}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-green-50 text-green-800 rounded font-bold text-[10px] uppercase border border-green-200">
                        {vac.type}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`font-mono text-[11px] font-bold block ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(vac.deadline).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {isExpired ? 'Deadline Passed' : 'Active Ticker'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center font-bold text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        {vac.viewsCount || 0}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center font-bold text-orange-700">
                        <Download className="w-3 h-3 mr-1" />
                        {vac.downloadsCount || 0}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(vac)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (safeConfirm(`Are you sure you want to delete "${vac.title}"?`)) {
                              deleteVacancy(vac.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {vacancies.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No vacancies posted yet. Click "Post New Vacancy" above to add job openings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

