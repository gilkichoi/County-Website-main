import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight, Globe, Facebook, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { countyBranding } = useData();

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.departments'), path: '/departments' },
    { name: t('nav.tourism'), path: '/tourism' },
    { name: t('nav.documents'), path: '/documents' },
    { name: t('nav.careers'), path: '/careers' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.contact'), path: '/contact' },
    { name: t('nav.admin'), path: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="bg-green-800 dark:bg-slate-950 text-white py-2 text-xs sm:text-sm border-b border-green-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> +254 (0) 788 186436</span>
            <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> info@taitataveta.go.ke</span>
          </div>
          <div className="flex items-center space-x-3 font-medium">
            <span className="hidden sm:inline-block">{t('header.officialWebsite')}</span>
            
            <button 
              onClick={toggleTheme}
              className="flex items-center hover:text-green-200 dark:hover:text-emerald-300 transition-colors bg-green-700/50 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-semibold"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 mr-1.5 text-slate-200" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button 
              onClick={toggleLanguage}
              className="flex items-center hover:text-green-200 dark:hover:text-emerald-300 transition-colors bg-green-700/50 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-semibold"
            >
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              {language === 'en' ? 'Swahili' : 'English'}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 md:py-0 md:h-20 gap-3 md:gap-0">
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            {countyBranding?.logoUrl ? (
              <img
                src={countyBranding.logoUrl}
                alt={countyBranding.countyName}
                className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-yellow-500">
                TT
              </div>
            )}
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
                {countyBranding?.countyName || 'Taita Taveta'}
              </h1>
              <p className="text-xs text-green-700 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                {countyBranding?.countyTagline || 'County Government'}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center overflow-x-auto hide-scrollbar space-x-1 sm:space-x-2 py-2 w-full md:w-auto">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.path)
                    ? 'bg-green-50 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-emerald-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const { countyBranding } = useData();
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              {countyBranding?.logoUrl ? (
                <img
                  src={countyBranding.logoUrl}
                  alt={countyBranding.countyName}
                  className="w-10 h-10 object-contain rounded bg-white p-0.5"
                />
              ) : (
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg border border-yellow-500">
                  TT
                </div>
              )}
              <div>
                <h2 className="font-bold text-lg leading-tight">{countyBranding?.countyName || 'Taita Taveta'}</h2>
                <p className="text-[10px] text-green-400 font-semibold tracking-wider uppercase">{countyBranding?.countyTagline || 'County Government'}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://web.facebook.com/TheTaitaTavetaCountyGovernment"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-9 h-9 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Government Structure</Link></li>
              <li><Link to="/documents" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Tenders & Notices</Link></li>
              <li><Link to="/careers" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Vacancies</Link></li>
              <li><Link to="/tourism" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Explore Taita Taveta</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">{t('footer.departments')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/departments/dept-2" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Health Services</Link></li>
              <li><Link to="/departments/dept-1" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Finance & Planning</Link></li>
              <li><Link to="/departments/dept-4" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Agriculture</Link></li>
              <li><Link to="/departments/dept-3" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-2"/> Tourism</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-green-500 shrink-0" />
                <span>County Headquarters, Mwatate<br/>P.O. Box 1062 - 80304,<br/>Mwatate, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-green-500 shrink-0" />
                <span>+254 (0) 788 186436</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-green-500 shrink-0" />
                <span>info@taitataveta.go.ke</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
