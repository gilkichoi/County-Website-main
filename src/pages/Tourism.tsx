import { MapPin, Compass } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Tourism() {
  const { touristSites, countyBranding } = useData();

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
          <div className="inline-flex items-center space-x-2 bg-green-700/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold mb-4 text-white border border-green-500/30">
            <Compass className="w-4 h-4 text-green-300" />
            <span>Tourism & Wildlife Attractions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Explore {countyBranding?.countyName || 'Taita Taveta'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Experience the breathtaking wildlife, majestic hills, natural springs, and rich heritage of our premier destination.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {touristSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {touristSites.map((site) => (
              <div key={site.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col group hover:shadow-md transition-all">
                <div className="h-72 overflow-hidden bg-gray-100 relative">
                  <img 
                    src={site.imageUrl || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80'} 
                    alt={site.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-green-400" />
                    {site.location}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center text-green-700 text-sm font-bold mb-2">
                    <MapPin className="w-4 h-4 mr-1.5" /> {site.location}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors">
                    {site.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed flex-grow text-sm sm:text-base whitespace-pre-line">
                    {site.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-xl mx-auto">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Tourist Sites Listed Yet</h3>
            <p className="text-xs text-gray-500 mt-1">Tourism destinations will appear here once added in the Admin Dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}

