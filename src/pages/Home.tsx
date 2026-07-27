import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, MapPin, Calendar, FileText, Briefcase, Landmark, Mail, 
  ExternalLink, Search, Bell, AlertCircle, X, Share2, Tag, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { FacebookFeed } from '../components/FacebookFeed';
import { NewsItem, EventItem } from '../types';

const heroImages = [
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80", // Beautiful nature/landscape
  "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1600&q=80", // Lake Jipe style landscape
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80", // Wildlife/Sanctuary
];

export function Home() {
  const { newsItems, eventItems, documents, departments, touristSites, governorMessage } = useData();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'notices' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const getDeptName = (id?: string) => {
    if (!id) return 'County Executive';
    return departments.find(d => d.id === id)?.name || 'County Department';
  };

  // Filtered lists
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'news') return item.category !== 'Notice';
    if (activeTab === 'notices') return item.category === 'Notice';
    return true;
  });

  const filteredEvents = eventItems.filter(item => {
    if (activeTab === 'news' || activeTab === 'notices') return false;
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Featured news item (top priority)
  const featuredItem = newsItems[0] || null;
  const recentNews = filteredNews.slice(0, 4);
  const upcomingEvents = filteredEvents.slice(0, 3);
  const featuredSites = touristSites.slice(0, 3);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Section with Slideshow */}
      <section className="relative bg-gray-900 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-gray-900 overflow-hidden">
          <AnimatePresence>
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="Taita Taveta Landscape"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent pointer-events-none"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-3xl z-10 relative">
            <span className="inline-block py-1 px-3 rounded-full bg-green-600/30 text-green-300 text-sm font-semibold tracking-wider uppercase mb-6 border border-green-500/30 shadow-sm">
              Welcome to Taita Taveta
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              The Land of <span className="text-yellow-400 drop-shadow-md">Endless Potential</span> & Rich Heritage
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed drop-shadow-sm">
              Official portal for the County Government. Access public services, discover investment opportunities, and explore our majestic tourist destinations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors flex items-center shadow-lg shadow-green-900/20">
                Our Government
              </Link>
              <Link to="/tourism" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg transition-colors flex items-center shadow-lg">
                Explore Tourism
              </Link>
            </div>
          </div>
          
          {/* Slideshow Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-yellow-400 w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links / Services */}
      <section className="py-12 bg-white relative z-20 -mt-12 mx-4 sm:mx-6 lg:mx-8 rounded-xl shadow-xl border border-gray-100 max-w-7xl xl:mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 lg:px-10">
          <Link to="/documents" className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-700 group-hover:text-white transition-all shadow-sm border border-red-100 group-hover:border-red-700">
              <Landmark className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Tenders & Bids</h3>
            <p className="text-xs text-gray-500">Procurement & notices</p>
          </Link>
          <Link to="/careers" className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-yellow-50 text-yellow-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-600 group-hover:text-white transition-all shadow-sm border border-yellow-100 group-hover:border-yellow-600">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Vacancies</h3>
            <p className="text-xs text-gray-500">Work with the county</p>
          </Link>
          <Link to="/documents" className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-green-50 text-green-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-700 group-hover:text-white transition-all shadow-sm border border-green-100 group-hover:border-green-700">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Budget Docs</h3>
            <p className="text-xs text-gray-500">Financial reports & CIDP</p>
          </Link>
          <Link to="/contact" className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-700 group-hover:text-white transition-all shadow-sm border border-blue-100 group-hover:border-blue-700">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Public Portal</h3>
            <p className="text-xs text-gray-500">Inquiries & Feedback</p>
          </Link>
        </div>
      </section>

      {/* Message from the Governor */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto relative">
                <img src={governorMessage.imageUrl} alt={governorMessage.name} className="absolute inset-0 w-full h-full object-cover object-top" />
              </div>
              <div className="md:w-2/3 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Message from the Governor</h2>
                <p className="text-xl text-green-700 font-medium mb-8">{governorMessage.name} - {governorMessage.title}</p>
                <div className="prose prose-lg text-gray-600 max-w-none">
                  <p className="leading-relaxed whitespace-pre-line text-lg">
                    {governorMessage.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News, Events, Notices & Social Media Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-green-700" /> County Communication Hub
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Latest News, Events & Public Notices
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl text-base">
                Official press releases, ward public participation notices, tenders, and upcoming events from the County Government of Taita Taveta.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-shadow"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Link 
                to="/news" 
                className="inline-flex items-center justify-center px-4 py-2.5 bg-green-700 text-white font-bold text-sm rounded-xl hover:bg-green-600 transition-colors shadow-sm whitespace-nowrap"
              >
                All News Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar space-x-2 mb-10 pb-2">
            {[
              { id: 'all', label: 'All Updates', icon: AlertCircle },
              { id: 'news', label: 'Press Releases', icon: FileText },
              { id: 'notices', label: 'Public Notices & Tenders', icon: Bell },
              { id: 'events', label: 'Upcoming Events', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center whitespace-nowrap border ${
                    isActive
                      ? 'bg-green-700 text-white border-green-700 shadow-md shadow-green-900/10'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: News, Notices & Featured Item (8 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Featured Spotlight Item */}
              {featuredItem && activeTab === 'all' && !searchQuery && (
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={featuredItem.mainImage || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"}
                      alt={featuredItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 bg-yellow-400 text-gray-950 font-black text-xs uppercase tracking-wider rounded-md shadow-md">
                        FEATURED
                      </span>
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white font-medium text-xs rounded-md border border-white/20">
                        {featuredItem.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <div className="flex items-center text-xs text-gray-300 font-medium mb-2 gap-4">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {featuredItem.date}</span>
                        <span className="flex items-center"><Tag className="w-3.5 h-3.5 mr-1" /> {getDeptName(featuredItem.departmentId)}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold leading-snug group-hover:text-yellow-300 transition-colors">
                        {featuredItem.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                      {featuredItem.summary}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedNews(featuredItem)}
                        className="inline-flex items-center text-green-700 font-bold text-sm hover:text-green-800 transition-colors"
                      >
                        Read Full Release <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                      <span className="text-xs text-gray-400 font-medium">Official Press Office</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of News & Notices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recentNews.length > 0 ? (
                  recentNews.map((news) => {
                    const isNotice = news.category === 'Notice';
                    return (
                      <div
                        key={news.id}
                        className={`bg-white rounded-2xl shadow-sm border ${
                          isNotice ? 'border-amber-200/80 bg-amber-50/20' : 'border-gray-200'
                        } overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer`}
                        onClick={() => setSelectedNews(news)}
                      >
                        {news.mainImage && (
                          <div className="w-full h-44 overflow-hidden relative">
                            <img
                              src={news.mainImage}
                              alt={news.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm ${
                                  isNotice
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-green-700 text-white'
                                }`}
                              >
                                {news.category}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-5 flex flex-col flex-grow">
                          {!news.mainImage && (
                            <div className="mb-3">
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block ${
                                  isNotice
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-green-100 text-green-800 border border-green-200'
                                }`}
                              >
                                {news.category}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center text-xs text-gray-400 mb-2 font-medium">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            <span>{news.date}</span>
                            <span className="mx-2">•</span>
                            <span className="truncate max-w-[140px]">{getDeptName(news.departmentId)}</span>
                          </div>

                          <h4 className="text-base font-bold text-gray-900 mb-2.5 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                            {news.title}
                          </h4>

                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                            {news.summary}
                          </p>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-green-700 mt-auto">
                            <span>Read Full Update</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
                    <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No news or notices match your search criteria.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                      className="mt-3 text-xs font-bold text-green-700 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Tenders & Notices Quick Download Banner */}
              <div className="bg-gradient-to-r from-emerald-900 to-green-800 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-yellow-300 font-bold text-xs uppercase tracking-wider">
                    <FileText className="w-4 h-4" /> County Transparency Portal
                  </div>
                  <h4 className="text-lg font-bold">Looking for Active Tenders & Budget Reports?</h4>
                  <p className="text-xs text-green-100 mt-1">Access verified PDF procurement documents, CIDP policies, and financial statements.</p>
                </div>
                <Link
                  to="/documents"
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-extrabold text-xs rounded-xl transition-colors shadow-sm whitespace-nowrap text-center"
                >
                  View Documents
                </Link>
              </div>

            </div>

            {/* Right Column: Facebook Feed & Upcoming Events (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Integrated Facebook Feed Component */}
              <FacebookFeed maxPosts={2} />

              {/* Upcoming Events Box */}
              {(activeTab === 'all' || activeTab === 'events') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-bold text-base">Upcoming Events</h3>
                    </div>
                    <Link to="/news" className="text-xs font-semibold text-yellow-400 hover:underline flex items-center">
                      Full Calendar <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>

                  <ul className="divide-y divide-gray-100">
                    {upcomingEvents.map((event) => {
                      const [, , day] = event.date.split('-');
                      return (
                        <li
                          key={event.id}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-yellow-50 rounded-xl p-2.5 text-center min-w-[56px] border border-yellow-200/80 shadow-sm shrink-0">
                              <span className="block text-[10px] font-extrabold text-yellow-800 uppercase tracking-wider">AUG</span>
                              <span className="block text-2xl font-black text-gray-900 leading-none mt-0.5">{day}</span>
                            </div>
                            <div className="flex-grow pt-0.5">
                              <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 leading-snug hover:text-green-700 transition-colors">
                                {event.title}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center font-medium mb-1">
                                <MapPin className="w-3.5 h-3.5 mr-1 text-red-500 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </p>
                              <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 inline-block">
                                {getDeptName(event.departmentId)}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                    <Link to="/news" className="text-xs font-bold text-green-700 hover:text-green-800">
                      View All County Town Halls & Outreach Events
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* News / Notice Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 relative"
            >
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-extrabold uppercase rounded-md border border-green-200">
                  {selectedNews.category}
                </span>
                <span className="text-xs text-gray-500 font-medium flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" /> {selectedNews.date}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600 font-medium">{getDeptName(selectedNews.departmentId)}</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedNews.title}
              </h3>

              {selectedNews.mainImage && (
                <div className="rounded-xl overflow-hidden mb-6 border border-gray-200 max-h-72">
                  <img src={selectedNews.mainImage} alt={selectedNews.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="prose prose-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                <p className="text-base text-gray-800 font-medium mb-3">{selectedNews.summary}</p>
                <p>
                  The County Government of Taita Taveta remains dedicated to transparent public communication and sustainable regional development under H.E. Governor Andrew Mwadime. For additional details or public participation queries, please contact the respective department office.
                </p>
              </div>

              {selectedNews.gallery && selectedNews.gallery.length > 0 && (
                <div className="mb-6 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Event Photo Gallery</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {selectedNews.gallery.map((img, idx) => (
                      <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0" />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="https://web.facebook.com/TheTaitaTavetaCountyGovernment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share on Facebook Page
                </a>

                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 p-6 relative"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-extrabold uppercase rounded-md border border-yellow-200">
                  UPCOMING EVENT
                </span>
                <span className="text-xs text-gray-500 font-medium">{getDeptName(selectedEvent.departmentId)}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h3>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-800 font-semibold">
                  <Calendar className="w-4 h-4 mr-2.5 text-yellow-600" /> Date: {selectedEvent.date}
                </div>
                <div className="flex items-center text-sm text-gray-800 font-semibold">
                  <MapPin className="w-4 h-4 mr-2.5 text-red-500" /> Location: {selectedEvent.location}
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                All community members and stakeholders are invited to attend. For disability accessibility accommodations or attendance inquiries, please reach out to the county public information desk.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <a
                  href="https://web.facebook.com/TheTaitaTavetaCountyGovernment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  View Updates on Facebook <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-green-700 text-white font-bold text-xs rounded-lg hover:bg-green-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tourism Highlight */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2 block">{t('nav.tourism')}</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{t('home.tourismTitle')}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('home.tourismSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSites.map((site) => (
              <div key={site.id} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="relative h-72 overflow-hidden">
                  <img src={site.imageUrl} alt={site.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="flex items-center text-yellow-400 text-xs font-bold mb-2 uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" /> {site.location}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{site.name}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">{site.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link to="/tourism" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-green-700 hover:bg-green-600 shadow-lg shadow-green-900/20 transition-all hover:-translate-y-1">
              {t('home.exploreAll')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
