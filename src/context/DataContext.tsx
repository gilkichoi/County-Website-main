import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  departments as initialDepartments, 
  newsItems as initialNews, 
  eventItems as initialEvents, 
  officialDocuments as initialDocs,
  officials as initialOfficials,
  touristSites as initialSites,
  vacancies as initialVacancies, initialGovernorMessage, initialEmergencyAlert
} from '../data';
import { Department, NewsItem, EventItem, Document, Official, TouristSite, Vacancy, GovernorMessage, EmergencyAlert } from '../types';

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
  
  saveDepartment: (dept: Department) => void;
  deleteDepartment: (id: string) => void;
  saveNewsItem: (news: NewsItem) => void;
  deleteNewsItem: (id: string) => void;
  saveEventItem: (event: EventItem) => void;
  deleteEventItem: (id: string) => void;
  saveDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  saveGovernorMessage: (msg: GovernorMessage) => void;
  saveEmergencyAlert: (alert: EmergencyAlert) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('tt_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('tt_news_v2');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [eventItems, setEventItems] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('tt_events_v2');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('tt_documents');
    return saved ? JSON.parse(saved) : initialDocs;
  });

  // For read-only entities in this prototype or future expansion
  const [officials] = useState<Official[]>(initialOfficials);
  const [touristSites] = useState<TouristSite[]>(initialSites);
  const [vacancies] = useState<Vacancy[]>(initialVacancies);
  const [governorMessage, setGovernorMessage] = useState<GovernorMessage>(() => {
    const saved = localStorage.getItem('tt_gov_msg');
    return saved ? JSON.parse(saved) : initialGovernorMessage;
  });
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert>(() => {
    const saved = localStorage.getItem('tt_emergency_alert');
    return saved ? JSON.parse(saved) : initialEmergencyAlert;
  });

  useEffect(() => { localStorage.setItem('tt_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('tt_news_v2', JSON.stringify(newsItems)); }, [newsItems]);
  useEffect(() => { localStorage.setItem('tt_events_v2', JSON.stringify(eventItems)); }, [eventItems]);
  useEffect(() => { localStorage.setItem('tt_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('tt_gov_msg', JSON.stringify(governorMessage)); }, [governorMessage]);
  useEffect(() => { localStorage.setItem('tt_emergency_alert', JSON.stringify(emergencyAlert)); }, [emergencyAlert]);

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
  
  const saveGovernorMessage = (msg: GovernorMessage) => {
    setGovernorMessage(msg);
  };

  const saveEmergencyAlert = (alert: EmergencyAlert) => {
    setEmergencyAlert(alert);
  };

  return (
    <DataContext.Provider value={{
      departments, newsItems, eventItems, documents, officials, touristSites, vacancies, governorMessage, emergencyAlert,
      saveDepartment, deleteDepartment,
      saveNewsItem, deleteNewsItem,
      saveEventItem, deleteEventItem,
      saveDocument, deleteDocument,
      saveGovernorMessage,
      saveEmergencyAlert
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
