import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.departments': 'Departments',
    'nav.tourism': 'Tourism',
    'nav.documents': 'Documents',
    'nav.careers': 'Careers',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'header.officialWebsite': 'Official Website of the County Government of Taita Taveta',
    'footer.quickLinks': 'Quick Links',
    'footer.departments': 'Departments',
    'footer.contactUs': 'Contact Us',
    'footer.rights': 'County Government of Taita Taveta. All rights reserved.',
    'footer.description': 'Dedicated to providing quality services, fostering sustainable development, and improving the livelihoods of all residents in our great county.',
    'home.latestNews': 'Latest News',
    'home.latestNewsSub': 'Official press releases and updates from the County',
    'home.allNews': 'All News',
    'home.upcomingEvents': 'Upcoming Events',
    'home.viewCalendar': 'View full calendar',
    'home.tourismTitle': 'Discover Taita Taveta',
    'home.tourismSub': 'Home to the world-renowned Tsavo National Parks, majestic hills, and rich history. Explore our premier tourist destinations.',
    'home.exploreAll': 'Explore All Destinations',
  },
  sw: {
    'nav.home': 'Mwanzo',
    'nav.about': 'Kuhusu Sisi',
    'nav.departments': 'Idara',
    'nav.tourism': 'Utalii',
    'nav.documents': 'Nyaraka',
    'nav.careers': 'Ajira',
    'nav.news': 'Habari',
    'nav.contact': 'Mawasiliano',
    'nav.admin': 'Msimamizi',
    'header.officialWebsite': 'Tovuti Rasmi ya Serikali ya Kaunti ya Taita Taveta',
    'footer.quickLinks': 'Viungo Muhimu',
    'footer.departments': 'Idara',
    'footer.contactUs': 'Wasiliana Nasi',
    'footer.rights': 'Serikali ya Kaunti ya Taita Taveta. Haki zote zimehifadhiwa.',
    'footer.description': 'Imejitolea kutoa huduma bora, kukuza maendeleo endelevu, na kuboresha maisha ya wakazi wote katika kaunti yetu kuu.',
    'home.latestNews': 'Habari za Hivi Punde',
    'home.latestNewsSub': 'Taarifa rasmi kwa vyombo vya habari na sasisho kutoka kwa Kaunti',
    'home.allNews': 'Habari Zote',
    'home.upcomingEvents': 'Matukio Yajayo',
    'home.viewCalendar': 'Tazama kalenda kamili',
    'home.tourismTitle': 'Gundua Taita Taveta',
    'home.tourismSub': 'Makao ya Mbuga za Kitaifa za Tsavo maarufu duniani, milima ya kuvutia, na historia tajiri. Gundua vivutio vyetu vya kwanza vya utalii.',
    'home.exploreAll': 'Gundua Vivutio Vyote',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('tt_language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('tt_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sw' : 'en');
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
