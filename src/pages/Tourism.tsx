import { MapPin } from 'lucide-react';
import { touristSites } from '../data';

export function Tourism() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80" 
            alt="Tourism Hero" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Explore Taita Taveta</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Experience the breathtaking wildlife, majestic landscapes, and rich cultural heritage of Kenya's premier destination.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {touristSites.map((site) => (
            <div key={site.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <div className="h-72 overflow-hidden">
                <img 
                  src={site.imageUrl} 
                  alt={site.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-green-600 text-sm font-semibold mb-3">
                  <MapPin className="w-4 h-4 mr-1" /> {site.location}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{site.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{site.description}</p>
                <button className="self-start px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Plan Your Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
