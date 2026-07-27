import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Users, FileText, Calendar, Building, Plus, Trash2, Edit2, X, UserCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Department, NewsItem, EventItem, Document, GovernorMessage, EmergencyAlert } from '../types';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'departments' | 'news' | 'events' | 'documents' | 'governor' | 'alert'>('alert');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-green-700" />
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">Manage county departments, emergency alerts, news, events, and documents.</p>
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
                  <button onClick={() => { if(confirm('Are you sure?')) deleteDepartment(dept.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
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
                  <button onClick={() => { if(confirm('Are you sure?')) deleteNewsItem(item.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
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
                  <button onClick={() => { if(confirm('Are you sure?')) deleteEventItem(item.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
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
                  <button onClick={() => { if(confirm('Are you sure?')) deleteDocument(item.id); }} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
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

