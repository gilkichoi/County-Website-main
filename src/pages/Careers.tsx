import { Briefcase, Clock, ChevronRight } from 'lucide-react';
import { vacancies, departments } from '../data';

export function Careers() {
  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'General';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Careers & Vacancies</h1>
          <p className="text-lg text-gray-600">
            Join our team and help us deliver quality services to the residents of Taita Taveta. Explore open positions below.
          </p>
        </div>

        <div className="space-y-4">
          {vacancies.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between group hover:border-green-300 transition-all">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                    {getDeptName(job.departmentId)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    Deadline: {job.deadline}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-green-50 text-green-700 text-xs font-semibold uppercase">
                    {job.type}
                  </span>
                </div>
              </div>
              <button className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg text-sm hover:bg-gray-800 transition-colors shrink-0">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
          {vacancies.length === 0 && (
            <div className="bg-white p-12 rounded-xl text-center border border-gray-100 shadow-sm text-gray-500">
              There are currently no open vacancies. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
