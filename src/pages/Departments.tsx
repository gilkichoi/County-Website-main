import { Link } from 'react-router-dom';
import { ArrowRight, Landmark } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Departments() {
  const { departments } = useData();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">County Departments</h1>
          <p className="text-lg text-gray-600">
            The County Government of Taita Taveta operates through various departments, each tasked with specific mandates to serve the public and drive development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
            <Link 
              key={dept.id} 
              to={`/departments/${dept.id}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-5 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Landmark className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{dept.name}</h2>
              <p className="text-gray-600 text-sm mb-6 flex-grow">{dept.description}</p>
              <div className="text-green-600 text-sm font-medium flex items-center mt-auto">
                View Department <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
