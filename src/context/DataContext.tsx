import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  departments as initialDepartments, 
  newsItems as initialNews, 
  eventItems as initialEvents, 
  officialDocuments as initialDocs,
  officials as initialOfficials,
  touristSites as initialSites,
  vacancies as initialVacancies, 
  initialGovernorMessage, 
  initialEmergencyAlert,
  initialHeroContent,
  initialCountyBranding,
  initialSystemUsers,
  initialAuditLogs
} from '../data';
import { 
  Department, 
  NewsItem, 
  EventItem, 
  Document, 
  Official, 
  TouristSite, 
  Vacancy, 
  GovernorMessage, 
  EmergencyAlert, 
  HeroContent, 
  CountyBranding,
  SystemUser,
  AuditLog
} from '../types';

interface DataContextType {
  // Filtered active collections (for public display)
  departments: Department[];
  newsItems: NewsItem[];
  eventItems: EventItem[];
  documents: Document[];
  officials: Official[];
  touristSites: TouristSite[];
  vacancies: Vacancy[];
  systemUsers: SystemUser[];
  auditLogs: AuditLog[];

  // All collections including soft-deleted items (for admin management)
  allDepartments: Department[];
  allNewsItems: NewsItem[];
  allEventItems: EventItem[];
  allDocuments: Document[];
  allOfficials: Official[];
  allTouristSites: TouristSite[];
  allVacancies: Vacancy[];
  allSystemUsers: SystemUser[];

  // Current logged in user context
  currentUser: SystemUser;
  setCurrentUser: (user: SystemUser) => void;

  // Audit Logs
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole' | 'userEmail'> & {
    userId?: string;
    userName?: string;
    userRole?: any;
    userEmail?: string;
  }) => void;
  clearAuditLogs: () => void;

  // Global settings
  governorMessage: GovernorMessage;
  emergencyAlert: EmergencyAlert;
  heroContent: HeroContent;
  countyBranding: CountyBranding;

  // Save / Add / Update
  saveDepartment: (dept: Department) => void;
  saveNewsItem: (news: NewsItem) => void;
  saveEventItem: (event: EventItem) => void;
  saveDocument: (doc: Document) => void;
  saveOfficial: (official: Official) => void;
  saveTouristSite: (site: TouristSite) => void;
  saveVacancy: (vacancy: Vacancy) => void;
  saveSystemUser: (user: SystemUser) => void;

  // Soft Delete (marks deleted = true)
  deleteDepartment: (id: string) => void;
  deleteNewsItem: (id: string) => void;
  deleteEventItem: (id: string) => void;
  deleteDocument: (id: string) => void;
  deleteOfficial: (id: string) => void;
  deleteTouristSite: (id: string) => void;
  deleteVacancy: (id: string) => void;
  deleteSystemUser: (id: string) => void;

  // Restore Soft-Deleted Items
  restoreDepartment: (id: string) => void;
  restoreNewsItem: (id: string) => void;
  restoreEventItem: (id: string) => void;
  restoreDocument: (id: string) => void;
  restoreOfficial: (id: string) => void;
  restoreTouristSite: (id: string) => void;
  restoreVacancy: (id: string) => void;
  restoreSystemUser: (id: string) => void;

  // Hard Delete (Permanent removal)
  hardDeleteDepartment: (id: string) => void;
  hardDeleteNewsItem: (id: string) => void;
  hardDeleteEventItem: (id: string) => void;
  hardDeleteDocument: (id: string) => void;
  hardDeleteOfficial: (id: string) => void;
  hardDeleteTouristSite: (id: string) => void;
  hardDeleteVacancy: (id: string) => void;
  hardDeleteSystemUser: (id: string) => void;

  // Counters
  incrementVacancyViews: (id: string) => void;
  incrementVacancyDownloads: (id: string) => void;

  // Global Settings Savers
  saveGovernorMessage: (msg: GovernorMessage) => void;
  saveEmergencyAlert: (alert: EmergencyAlert) => void;
  saveHeroContent: (content: HeroContent) => void;
  saveCountyBranding: (branding: CountyBranding) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Raw state collections
  const [rawDepartments, setRawDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('tt_departments');
      return saved ? JSON.parse(saved) : initialDepartments;
    } catch {
      return initialDepartments;
    }
  });

  const [rawNewsItems, setRawNewsItems] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_news_v2');
      return saved ? JSON.parse(saved) : initialNews;
    } catch {
      return initialNews;
    }
  });

  const [rawEventItems, setRawEventItems] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_events_v2');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  const [rawDocuments, setRawDocuments] = useState<Document[]>(() => {
    try {
      const saved = localStorage.getItem('tt_documents');
      return saved ? JSON.parse(saved) : initialDocs;
    } catch {
      return initialDocs;
    }
  });

  const [rawOfficials, setRawOfficials] = useState<Official[]>(() => {
    try {
      const saved = localStorage.getItem('tt_officials_v3');
      return saved ? JSON.parse(saved) : initialOfficials;
    } catch {
      return initialOfficials;
    }
  });

  const [rawTouristSites, setRawTouristSites] = useState<TouristSite[]>(() => {
    try {
      const saved = localStorage.getItem('tt_tourist_sites');
      return saved ? JSON.parse(saved) : initialSites;
    } catch {
      return initialSites;
    }
  });

  const [rawVacancies, setRawVacancies] = useState<Vacancy[]>(() => {
    try {
      const saved = localStorage.getItem('tt_vacancies_v2');
      return saved ? JSON.parse(saved) : initialVacancies;
    } catch {
      return initialVacancies;
    }
  });

  const [rawSystemUsers, setRawSystemUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('tt_system_users_v1');
      return saved ? JSON.parse(saved) : initialSystemUsers;
    } catch {
      return initialSystemUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    try {
      const savedId = localStorage.getItem('tt_current_user_id');
      if (savedId) {
        const found = rawSystemUsers.find(u => u.id === savedId);
        if (found) return found;
      }
      return rawSystemUsers[0] || initialSystemUsers[0];
    } catch {
      return initialSystemUsers[0];
    }
  });

  const [governorMessage, setGovernorMessage] = useState<GovernorMessage>(() => {
    try {
      const saved = localStorage.getItem('tt_gov_msg');
      return saved ? JSON.parse(saved) : initialGovernorMessage;
    } catch {
      return initialGovernorMessage;
    }
  });

  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert>(() => {
    try {
      const saved = localStorage.getItem('tt_emergency_alert');
      return saved ? JSON.parse(saved) : initialEmergencyAlert;
    } catch {
      return initialEmergencyAlert;
    }
  });

  const [heroContent, setHeroContent] = useState<HeroContent>(() => {
    try {
      const saved = localStorage.getItem('tt_hero_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides)) return parsed;
      }
      return initialHeroContent;
    } catch {
      return initialHeroContent;
    }
  });

  const [countyBranding, setCountyBranding] = useState<CountyBranding>(() => {
    try {
      const saved = localStorage.getItem('tt_county_branding');
      return saved ? JSON.parse(saved) : initialCountyBranding;
    } catch {
      return initialCountyBranding;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('tt_audit_logs_v1');
      return saved ? JSON.parse(saved) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  // Save to localStorage
  useEffect(() => { try { localStorage.setItem('tt_departments', JSON.stringify(rawDepartments)); } catch (e) { console.warn(e); } }, [rawDepartments]);
  useEffect(() => { try { localStorage.setItem('tt_news_v2', JSON.stringify(rawNewsItems)); } catch (e) { console.warn(e); } }, [rawNewsItems]);
  useEffect(() => { try { localStorage.setItem('tt_events_v2', JSON.stringify(rawEventItems)); } catch (e) { console.warn(e); } }, [rawEventItems]);
  useEffect(() => { try { localStorage.setItem('tt_documents', JSON.stringify(rawDocuments)); } catch (e) { console.warn(e); } }, [rawDocuments]);
  useEffect(() => { try { localStorage.setItem('tt_officials_v3', JSON.stringify(rawOfficials)); } catch (e) { console.warn(e); } }, [rawOfficials]);
  useEffect(() => { try { localStorage.setItem('tt_tourist_sites', JSON.stringify(rawTouristSites)); } catch (e) { console.warn(e); } }, [rawTouristSites]);
  useEffect(() => { try { localStorage.setItem('tt_vacancies_v2', JSON.stringify(rawVacancies)); } catch (e) { console.warn(e); } }, [rawVacancies]);
  useEffect(() => { try { localStorage.setItem('tt_system_users_v1', JSON.stringify(rawSystemUsers)); } catch (e) { console.warn(e); } }, [rawSystemUsers]);
  useEffect(() => { try { localStorage.setItem('tt_current_user_id', currentUser.id); } catch (e) { console.warn(e); } }, [currentUser]);
  useEffect(() => { try { localStorage.setItem('tt_gov_msg', JSON.stringify(governorMessage)); } catch (e) { console.warn(e); } }, [governorMessage]);
  useEffect(() => { try { localStorage.setItem('tt_emergency_alert', JSON.stringify(emergencyAlert)); } catch (e) { console.warn(e); } }, [emergencyAlert]);
  useEffect(() => { try { localStorage.setItem('tt_hero_content', JSON.stringify(heroContent)); } catch (e) { console.warn(e); } }, [heroContent]);
  useEffect(() => { try { localStorage.setItem('tt_county_branding', JSON.stringify(countyBranding)); } catch (e) { console.warn(e); } }, [countyBranding]);
  useEffect(() => { try { localStorage.setItem('tt_audit_logs_v1', JSON.stringify(auditLogs)); } catch (e) { console.warn(e); } }, [auditLogs]);

  // Audit Log Helper
  const addAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole' | 'userEmail'> & {
    userId?: string;
    userName?: string;
    userRole?: any;
    userEmail?: string;
  }) => {
    const now = new Date();
    const formattedTimestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formattedTimestamp,
      userId: logData.userId || currentUser.id,
      userName: logData.userName || currentUser.name,
      userRole: logData.userRole || currentUser.role,
      userEmail: logData.userEmail || currentUser.email,
      action: logData.action,
      module: logData.module,
      details: logData.details,
      departmentId: logData.departmentId,
      ipAddress: logData.ipAddress || '197.232.88.14'
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  const handleSetCurrentUser = (user: SystemUser) => {
    setCurrentUser(user);
    addAuditLog({
      action: 'SESSION_SWITCH',
      module: 'System',
      details: `Switched active session to ${user.role}: ${user.name} (${user.email})`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email
    });
  };


  // Derived Active Collections for Public Display
  const departments = rawDepartments.filter(d => !d.deleted);
  const newsItems = rawNewsItems.filter(n => !n.deleted);
  const eventItems = rawEventItems.filter(e => !e.deleted);
  const documents = rawDocuments.filter(d => !d.deleted);
  const officials = rawOfficials.filter(o => !o.deleted);
  const touristSites = rawTouristSites.filter(t => !t.deleted);
  const vacancies = rawVacancies.filter(v => !v.deleted);
  const systemUsers = rawSystemUsers.filter(u => !u.deleted);

  // SAVE HANDLERS
  const saveDepartment = (dept: Department) => {
    setRawDepartments(prev => {
      const exists = prev.find(d => d.id === dept.id);
      if (exists) return prev.map(d => d.id === dept.id ? { ...dept, deleted: false } : d);
      return [...prev, { ...dept, deleted: false }];
    });
  };

  const saveNewsItem = (news: NewsItem) => {
    setRawNewsItems(prev => {
      const exists = prev.find(n => n.id === news.id);
      if (exists) return prev.map(n => n.id === news.id ? { ...news, deleted: false } : n);
      return [{ ...news, deleted: false }, ...prev];
    });
  };

  const saveEventItem = (event: EventItem) => {
    setRawEventItems(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) return prev.map(e => e.id === event.id ? { ...event, deleted: false } : e);
      return [{ ...event, deleted: false }, ...prev];
    });
  };

  const saveDocument = (doc: Document) => {
    setRawDocuments(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) return prev.map(d => d.id === doc.id ? { ...doc, deleted: false } : d);
      return [{ ...doc, deleted: false }, ...prev];
    });
  };

  const saveOfficial = (official: Official) => {
    setRawOfficials(prev => {
      const exists = prev.find(o => o.id === official.id);
      if (exists) return prev.map(o => o.id === official.id ? { ...official, deleted: false } : o);
      return [...prev, { ...official, deleted: false }];
    });
  };

  const saveTouristSite = (site: TouristSite) => {
    setRawTouristSites(prev => {
      const exists = prev.find(s => s.id === site.id);
      if (exists) return prev.map(s => s.id === site.id ? { ...site, deleted: false } : s);
      return [...prev, { ...site, deleted: false }];
    });
  };

  const saveVacancy = (vacancy: Vacancy) => {
    setRawVacancies(prev => {
      const exists = prev.find(v => v.id === vacancy.id);
      if (exists) return prev.map(v => v.id === vacancy.id ? { ...vacancy, deleted: false } : v);
      return [{ ...vacancy, deleted: false }, ...prev];
    });
  };

  const saveSystemUser = (user: SystemUser) => {
    setRawSystemUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) return prev.map(u => u.id === user.id ? { ...user, deleted: false } : u);
      return [...prev, { ...user, deleted: false }];
    });
    if (currentUser.id === user.id) {
      setCurrentUser(user);
    }
  };

  // SOFT DELETE HANDLERS
  const deleteDepartment = (id: string) => {
    setRawDepartments(prev => prev.map(d => d.id === id ? { ...d, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : d));
  };
  const deleteNewsItem = (id: string) => {
    setRawNewsItems(prev => prev.map(n => n.id === id ? { ...n, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : n));
  };
  const deleteEventItem = (id: string) => {
    setRawEventItems(prev => prev.map(e => e.id === id ? { ...e, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : e));
  };
  const deleteDocument = (id: string) => {
    setRawDocuments(prev => prev.map(d => d.id === id ? { ...d, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : d));
  };
  const deleteOfficial = (id: string) => {
    setRawOfficials(prev => prev.map(o => o.id === id ? { ...o, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : o));
  };
  const deleteTouristSite = (id: string) => {
    setRawTouristSites(prev => prev.map(t => t.id === id ? { ...t, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : t));
  };
  const deleteVacancy = (id: string) => {
    setRawVacancies(prev => prev.map(v => v.id === id ? { ...v, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : v));
  };
  const deleteSystemUser = (id: string) => {
    setRawSystemUsers(prev => prev.map(u => u.id === id ? { ...u, deleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser.name } : u));
  };

  // RESTORE HANDLERS
  const restoreDepartment = (id: string) => {
    setRawDepartments(prev => prev.map(d => d.id === id ? { ...d, deleted: false, deletedAt: undefined, deletedBy: undefined } : d));
  };
  const restoreNewsItem = (id: string) => {
    setRawNewsItems(prev => prev.map(n => n.id === id ? { ...n, deleted: false, deletedAt: undefined, deletedBy: undefined } : n));
  };
  const restoreEventItem = (id: string) => {
    setRawEventItems(prev => prev.map(e => e.id === id ? { ...e, deleted: false, deletedAt: undefined, deletedBy: undefined } : e));
  };
  const restoreDocument = (id: string) => {
    setRawDocuments(prev => prev.map(d => d.id === id ? { ...d, deleted: false, deletedAt: undefined, deletedBy: undefined } : d));
  };
  const restoreOfficial = (id: string) => {
    setRawOfficials(prev => prev.map(o => o.id === id ? { ...o, deleted: false, deletedAt: undefined, deletedBy: undefined } : o));
  };
  const restoreTouristSite = (id: string) => {
    setRawTouristSites(prev => prev.map(t => t.id === id ? { ...t, deleted: false, deletedAt: undefined, deletedBy: undefined } : t));
  };
  const restoreVacancy = (id: string) => {
    setRawVacancies(prev => prev.map(v => v.id === id ? { ...v, deleted: false, deletedAt: undefined, deletedBy: undefined } : v));
  };
  const restoreSystemUser = (id: string) => {
    setRawSystemUsers(prev => prev.map(u => u.id === id ? { ...u, deleted: false, deletedAt: undefined, deletedBy: undefined } : u));
  };

  // HARD DELETE HANDLERS
  const hardDeleteDepartment = (id: string) => setRawDepartments(prev => prev.filter(d => d.id !== id));
  const hardDeleteNewsItem = (id: string) => setRawNewsItems(prev => prev.filter(n => n.id !== id));
  const hardDeleteEventItem = (id: string) => setRawEventItems(prev => prev.filter(e => e.id !== id));
  const hardDeleteDocument = (id: string) => setRawDocuments(prev => prev.filter(d => d.id !== id));
  const hardDeleteOfficial = (id: string) => setRawOfficials(prev => prev.filter(o => o.id !== id));
  const hardDeleteTouristSite = (id: string) => setRawTouristSites(prev => prev.filter(t => t.id !== id));
  const hardDeleteVacancy = (id: string) => setRawVacancies(prev => prev.filter(v => v.id !== id));
  const hardDeleteSystemUser = (id: string) => setRawSystemUsers(prev => prev.filter(u => u.id !== id));

  const incrementVacancyViews = (id: string) => {
    setRawVacancies(prev => prev.map(v => v.id === id ? { ...v, viewsCount: (v.viewsCount || 0) + 1 } : v));
  };

  const incrementVacancyDownloads = (id: string) => {
    setRawVacancies(prev => prev.map(v => v.id === id ? { ...v, downloadsCount: (v.downloadsCount || 0) + 1 } : v));
  };

  const saveGovernorMessage = (msg: GovernorMessage) => setGovernorMessage(msg);
  const saveEmergencyAlert = (alert: EmergencyAlert) => setEmergencyAlert(alert);
  const saveHeroContent = (content: HeroContent) => setHeroContent(content);
  const saveCountyBranding = (branding: CountyBranding) => setCountyBranding(branding);

  return (
    <DataContext.Provider value={{
      departments, newsItems, eventItems, documents, officials, touristSites, vacancies, systemUsers,
      auditLogs,
      allDepartments: rawDepartments,
      allNewsItems: rawNewsItems,
      allEventItems: rawEventItems,
      allDocuments: rawDocuments,
      allOfficials: rawOfficials,
      allTouristSites: rawTouristSites,
      allVacancies: rawVacancies,
      allSystemUsers: rawSystemUsers,

      currentUser,
      setCurrentUser: handleSetCurrentUser,

      addAuditLog,
      clearAuditLogs,

      governorMessage, emergencyAlert, heroContent, countyBranding,

      saveDepartment, saveNewsItem, saveEventItem, saveDocument, saveOfficial, saveTouristSite, saveVacancy, saveSystemUser,
      deleteDepartment, deleteNewsItem, deleteEventItem, deleteDocument, deleteOfficial, deleteTouristSite, deleteVacancy, deleteSystemUser,
      restoreDepartment, restoreNewsItem, restoreEventItem, restoreDocument, restoreOfficial, restoreTouristSite, restoreVacancy, restoreSystemUser,
      hardDeleteDepartment, hardDeleteNewsItem, hardDeleteEventItem, hardDeleteDocument, hardDeleteOfficial, hardDeleteTouristSite, hardDeleteVacancy, hardDeleteSystemUser,

      incrementVacancyViews, incrementVacancyDownloads,
      saveGovernorMessage, saveEmergencyAlert, saveHeroContent, saveCountyBranding
    }}>
      {children}
    </DataContext.Provider>
  );

};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
