import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { departments, newsItems, eventItems, officials } = useData();
  
  const department = departments.find(d => d.id === id);
  const deptNews = newsItems.filter(n => n.departmentId === id);
  const deptEvents = eventItems.filter(e => e.departmentId === id);
  const deptOfficials = officials.filter(o => o.departmentId === id);

  if (!department) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
          <Link to="/departments" className="text-green-600 hover:underline">Return to Departments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 border-t-4 border-t-green-600">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{department.name}</h1>
          <div className="prose prose-green max-w-none">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mandate</h3>
            <p className="text-gray-600 mb-6">{department.mandate}</p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600">{department.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: News & Events */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Department News */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Department News</h2>
              {deptNews.length > 0 ? (
                <div className="space-y-6">
                  {deptNews.map(news => (
                    <article key={news.id} className="group">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-green-50 text-green-700 uppercase tracking-wider">{news.category}</span>
                        <span className="text-sm text-gray-400">{news.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{news.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{news.summary}</p>
                      <Link to="#" className="text-green-600 text-sm font-medium hover:underline inline-flex items-center">
                        Read full story <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No recent news for this department.</p>
              )}
            </section>

            {/* Department Events */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Upcoming Events</h2>
              {deptEvents.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {deptEvents.map(event => (
                    <li key={event.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-gray-50 rounded-lg p-3 text-center border border-gray-100 mr-4">
                          <Calendar className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <span className="block text-xs font-semibold text-gray-500">{event.date}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No upcoming events scheduled.</p>
              )}
            </section>
          </div>

          {/* Sidebar: Leadership */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Department Leadership</h3>
              {deptOfficials.length > 0 ? (
                <div className="space-y-6">
                  {deptOfficials.map(official => (
                    <div key={official.id} className="flex items-center space-x-4">
                      <img src={official.imagePlaceholder} alt={official.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{official.name}</h4>
                        <p className="text-green-600 text-xs font-medium uppercase mt-1">{official.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">Leadership information not available.</p>
              )}
            </div>
            
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <h3 className="text-sm font-bold text-green-900 mb-2 uppercase tracking-wide">Quick Contact</h3>
              <p className="text-sm text-green-800 mb-4">Have an inquiry for this department?</p>
              <Link to="/contact" className="block w-full text-center bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
