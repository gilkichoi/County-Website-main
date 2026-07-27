import { Calendar, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FacebookFeed } from '../components/FacebookFeed';

export function News() {
  const { newsItems, eventItems, departments } = useData();

  const getDeptName = (id?: string) => {
    if (!id) return 'General County News';
    return departments.find(d => d.id === id)?.name || 'General';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">News & Events</h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest press releases, announcements, and upcoming events from the County Government.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* News List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600 inline-block">Latest News & Press Releases</h2>
            <div className="space-y-6">
              {newsItems.map((news) => (
                <div key={news.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {news.mainImage && (
                    <div className="w-full h-64 overflow-hidden">
                      <img src={news.mainImage} alt={news.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded">
                        {news.category}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {news.date}
                      </span>
                      <span className="text-sm text-gray-400 hidden sm:inline">•</span>
                      <span className="text-sm text-gray-500">
                        {getDeptName(news.departmentId)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{news.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{news.summary}</p>
                    
                    {news.gallery && news.gallery.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2 text-gray-500" /> Photo Gallery
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                          {news.gallery.map((img, i) => (
                            <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0 shadow-sm" />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Link to="#" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                      Read full article <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="space-y-8">
            <FacebookFeed maxPosts={2} />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Upcoming Events</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {eventItems.map((event) => {
                  const [, , day] = event.date.split('-');
                  return (
                    <li key={event.id} className="hover:bg-gray-50 transition-colors">
                      {event.mainImage && (
                        <div className="w-full h-32 overflow-hidden border-b border-gray-100">
                          <img src={event.mainImage} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex gap-5 mb-4">
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center min-w-[70px] text-center shrink-0">
                            <span className="text-xs font-bold text-gray-500 uppercase">Aug</span>
                            <span className="text-2xl font-bold text-gray-900 leading-none mt-1">{day}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {event.location}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" /> {getDeptName(event.departmentId)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {event.gallery && event.gallery.length > 0 && (
                          <div className="mt-4">
                            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                              {event.gallery.map((img, i) => (
                                <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-16 h-16 object-cover rounded-md border border-gray-200 shrink-0" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
