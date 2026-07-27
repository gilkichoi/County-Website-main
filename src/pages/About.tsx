import { officials } from '../data';

export function About() {
  const governor = officials.find(o => o.type === 'Governor');
  const deputyGovernor = officials.find(o => o.type === 'Deputy Governor');
  const cecms = officials.filter(o => o.type === 'CECM');
  const ccos = officials.filter(o => o.type === 'CCO');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Government Structure</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Meet the leadership team dedicated to driving sustainable development, improving service delivery, and enhancing the livelihoods of the people of Taita Taveta County.
          </p>
        </div>

        {/* Executive Leadership */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">County Executive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {governor && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center p-8 text-center">
                <img src={governor.imagePlaceholder} alt={governor.name} className="w-40 h-40 object-cover rounded-full shadow-md mb-6 border-4 border-white" />
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{governor.name}</h3>
                <p className="text-green-700 font-semibold tracking-wide uppercase text-sm mb-4">{governor.role}</p>
                <p className="text-gray-500 text-sm">Leading the executive team to deliver on the county\'s mandate and development agenda.</p>
              </div>
            )}
            {deputyGovernor && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center p-8 text-center">
                <img src={deputyGovernor.imagePlaceholder} alt={deputyGovernor.name} className="w-40 h-40 object-cover rounded-full shadow-md mb-6 border-4 border-white" />
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{deputyGovernor.name}</h3>
                <p className="text-green-700 font-semibold tracking-wide uppercase text-sm mb-4">{deputyGovernor.role}</p>
                <p className="text-gray-500 text-sm">Assisting the Governor in the administration and management of county affairs.</p>
              </div>
            )}
          </div>
        </section>

        {/* CECMs */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">County Executive Committee Members (CECMs)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cecms.map(cecm => (
              <div key={cecm.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <img src={cecm.imagePlaceholder} alt={cecm.name} className="w-24 h-24 object-cover rounded-full shadow-sm mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cecm.name}</h3>
                <p className="text-green-600 font-medium text-sm">{cecm.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CCOs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">Chief Officers (CCOs)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ccos.map(cco => (
              <div key={cco.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
                <img src={cco.imagePlaceholder} alt={cco.name} className="w-16 h-16 object-cover rounded-full shadow-sm" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{cco.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">{cco.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
