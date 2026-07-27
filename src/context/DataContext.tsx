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
  initialCountyBranding
} from '../data';
import { Department, NewsItem, EventItem, Document, Official, TouristSite, Vacancy, GovernorMessage, EmergencyAlert, HeroContent, CountyBranding } from '../types';

interface DataContextType {
  departments: Department[];
  newsItems: NewsItem[];
  eventItems: EventItem[];
  documents: Document[];
  officials: Official[];
  touristSites: TouristSite[];
  vacancies: Vacancy[];
  governorMessage: GovernorMessage;
  emergencyAlert: EmergencyAlert;
  heroContent: HeroContent;
  countyBranding: CountyBranding;
  
  saveDepartment: (dept: Department) => void;
  deleteDepartment: (id: string) => void;
  saveNewsItem: (news: NewsItem) => void;
  deleteNewsItem: (id: string) => void;
  saveEventItem: (event: EventItem) => void;
  deleteEventItem: (id: string) => void;
  saveDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  saveOfficial: (official: Official) => void;
  deleteOfficial: (id: string) => void;
  saveTouristSite: (site: TouristSite) => void;
  deleteTouristSite: (id: string) => void;
  saveVacancy: (vacancy: Vacancy) => void;
  deleteVacancy: (id: string) => void;
  incrementVacancyViews: (id: string) => void;
  incrementVacancyDownloads: (id: string) => void;
  saveGovernorMessage: (msg: GovernorMessage) => void;
  saveEmergencyAlert: (alert: EmergencyAlert) => void;
  saveHeroContent: (content: HeroContent) => void;
  saveCountyBranding: (branding: CountyBranding) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('tt_departments');
      return saved ? JSON.parse(saved) : initialDepartments;
    } catch {
      return initialDepartments;
    }
  });

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_news_v2');
      return saved ? JSON.parse(saved) : initialNews;
    } catch {
      return initialNews;
    }
  });

  const [eventItems, setEventItems] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_events_v2');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    try {
      const saved = localStorage.getItem('tt_documents');
      return saved ? JSON.parse(saved) : initialDocs;
    } catch {
      return initialDocs;
    }
  });

  const [officials, setOfficials] = useState<Official[]>(() => {
    try {
      const saved = localStorage.getItem('tt_officials_v3');
      return saved ? JSON.parse(saved) : initialOfficials;
    } catch {
      return initialOfficials;
    }
  });

  const [touristSites, setTouristSites] = useState<TouristSite[]>(() => {
    try {
      const saved = localStorage.getItem('tt_tourist_sites');
      return saved ? JSON.parse(saved) : initialSites;
    } catch {
      return initialSites;
    }
  });
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    try {
      const saved = localStorage.getItem('tt_vacancies_v2');
      return saved ? JSON.parse(saved) : initialVacancies;
    } catch {
      return initialVacancies;
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

  useEffect(() => { try { localStorage.setItem('tt_departments', JSON.stringify(departments)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [departments]);
  useEffect(() => { try { localStorage.setItem('tt_news_v2', JSON.stringify(newsItems)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [newsItems]);
  useEffect(() => { try { localStorage.setItem('tt_events_v2', JSON.stringify(eventItems)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [eventItems]);
  useEffect(() => { try { localStorage.setItem('tt_documents', JSON.stringify(documents)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [documents]);
  useEffect(() => { try { localStorage.setItem('tt_officials_v3', JSON.stringify(officials)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [officials]);
  useEffect(() => { try { localStorage.setItem('tt_tourist_sites', JSON.stringify(touristSites)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [touristSites]);
  useEffect(() => { try { localStorage.setItem('tt_vacancies_v2', JSON.stringify(vacancies)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [vacancies]);
  useEffect(() => { try { localStorage.setItem('tt_gov_msg', JSON.stringify(governorMessage)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [governorMessage]);
  useEffect(() => { try { localStorage.setItem('tt_emergency_alert', JSON.stringify(emergencyAlert)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [emergencyAlert]);
  useEffect(() => { try { localStorage.setItem('tt_hero_content', JSON.stringify(heroContent)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [heroContent]);
  useEffect(() => { try { localStorage.setItem('tt_county_branding', JSON.stringify(countyBranding)); } catch (e) { console.warn('LocalStorage save failed:', e); } }, [countyBranding]);

  const saveDepartment = (dept: Department) => {
    setDepartments(prev => {
      const exists = prev.find(d => d.id === dept.id);
      if (exists) return prev.map(d => d.id === dept.id ? dept : d);
      return [...prev, dept];
    });
  };
  const deleteDepartment = (id: string) => setDepartments(prev => prev.filter(d => d.id !== id));

  const saveNewsItem = (news: NewsItem) => {
    setNewsItems(prev => {
      const exists = prev.find(n => n.id === news.id);
      if (exists) return prev.map(n => n.id === news.id ? news : n);
      return [...prev, news];
    });
  };
  const deleteNewsItem = (id: string) => setNewsItems(prev => prev.filter(n => n.id !== id));

  const saveEventItem = (event: EventItem) => {
    setEventItems(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) return prev.map(e => e.id === event.id ? event : e);
      return [...prev, event];
    });
  };
  const deleteEventItem = (id: string) => setEventItems(prev => prev.filter(e => e.id !== id));

  const saveDocument = (doc: Document) => {
    setDocuments(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) return prev.map(d => d.id === doc.id ? doc : d);
      return [...prev, doc];
    });
  };
  const deleteDocument = (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));

  const saveOfficial = (official: Official) => {
    setOfficials(prev => {
      const exists = prev.find(o => o.id === official.id);
      if (exists) return prev.map(o => o.id === official.id ? official : o);
      return [...prev, official];
    });
  };
  const deleteOfficial = (id: string) => setOfficials(prev => prev.filter(o => o.id !== id));

  const saveTouristSite = (site: TouristSite) => {
    setTouristSites(prev => {
      const exists = prev.find(s => s.id === site.id);
      if (exists) return prev.map(s => s.id === site.id ? site : s);
      return [...prev, site];
    });
  };
  const deleteTouristSite = (id: string) => setTouristSites(prev => prev.filter(s => s.id !== id));

  const saveVacancy = (vacancy: Vacancy) => {
    setVacancies(prev => {
      const exists = prev.find(v => v.id === vacancy.id);
      if (exists) return prev.map(v => v.id === vacancy.id ? vacancy : v);
      return [vacancy, ...prev];
    });
  };
  const deleteVacancy = (id: string) => setVacancies(prev => prev.filter(v => v.id !== id));

  const incrementVacancyViews = (id: string) => {
    setVacancies(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, viewsCount: (v.viewsCount || 0) + 1 };
      }
      return v;
    }));
  };

  const incrementVacancyDownloads = (id: string) => {
    setVacancies(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, downloadsCount: (v.downloadsCount || 0) + 1 };
      }
      return v;
    }));
  };

  const saveGovernorMessage = (msg: GovernorMessage) => {
    setGovernorMessage(msg);
  };

  const saveEmergencyAlert = (alert: EmergencyAlert) => {
    setEmergencyAlert(alert);
  };

  const saveHeroContent = (content: HeroContent) => {
    setHeroContent(content);
  };

  const saveCountyBranding = (branding: CountyBranding) => {
    setCountyBranding(branding);
  };

  return (
    <DataContext.Provider value={{
      departments, newsItems, eventItems, documents, officials, touristSites, vacancies, governorMessage, emergencyAlert, heroContent, countyBranding,
      saveDepartment, deleteDepartment,
      saveNewsItem, deleteNewsItem,
      saveEventItem, deleteEventItem,
      saveDocument, deleteDocument,
      saveOfficial, deleteOfficial,
      saveTouristSite, deleteTouristSite,
      saveVacancy, deleteVacancy, incrementVacancyViews, incrementVacancyDownloads,
      saveGovernorMessage,
      saveEmergencyAlert,
      saveHeroContent,
      saveCountyBranding
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
