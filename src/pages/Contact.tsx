import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, Building2, ShieldAlert, Navigation, Copy, Check, Compass } from 'lucide-react';

export function Contact() {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const officialPhone = "+254 (0) 788 186436";
  const cleanPhone = "+254788186436";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+254788186436");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const subCountyOffices = [
    {
      name: "Mwatate Sub-County HQ",
      location: "Mwatate Town Center, Near Sub-County Offices",
      phone: "+254 (0) 788 186436",
      email: "mwatate@taitataveta.go.ke"
    },
    {
      name: "Voi Sub-County Office",
      location: "Voi Town, Opposite Voi Law Courts",
      phone: "+254 (0) 788 186436",
      email: "voi@taitataveta.go.ke"
    },
    {
      name: "Taveta Sub-County Office",
      location: "Taveta Border Town, Government Zone",
      phone: "+254 (0) 788 186436",
      email: "taveta@taitataveta.go.ke"
    },
    {
      name: "Wundanyi Sub-County Office",
      location: "Wundanyi Town, Former District HQ Complex",
      phone: "+254 (0) 788 186436",
      email: "wundanyi@taitataveta.go.ke"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            County Administration Directory
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Contact & Headquarters
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Official contact information for the County Government of Taita Taveta. Visit our central headquarters in Mwatate or reach out to our administration teams.
          </p>
        </div>

        {/* Primary Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Headquarters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-green-50 text-green-700 rounded-xl flex items-center justify-center mb-4 border border-green-100">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">County Headquarters</h3>
              <p className="text-xs text-gray-500 font-medium mb-3">Mwatate Central Administration</p>
              <address className="not-italic text-xs text-gray-600 leading-relaxed space-y-1">
                <p className="font-semibold text-gray-800">Taita Taveta County HQ</p>
                <p>P.O. Box 1062 - 80304</p>
                <p>Mwatate, Taita Taveta County, Kenya</p>
              </address>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-green-700 font-bold">
              <span>Mwatate Town</span>
              <Compass className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Official Phone */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 border border-orange-100">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Telephone Line</h3>
              <p className="text-xs text-gray-500 font-medium mb-3">General Inquiries & Customer Desk</p>
              <div className="space-y-1">
                <a
                  href={`tel:${cleanPhone}`}
                  className="text-sm font-extrabold text-orange-600 hover:text-orange-700 hover:underline block"
                >
                  {officialPhone}
                </a>
                <p className="text-xs text-gray-500">Mon – Fri, 8:00 AM – 5:00 PM</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900 font-bold"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600 mr-1" />
                    <span className="text-green-600">Copied Number</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy Phone Number</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Email Addresses */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Official Emails</h3>
              <p className="text-xs text-gray-500 font-medium mb-3">Official Correspondence</p>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">General Enquiries</span>
                  <a href="mailto:info@taitataveta.go.ke" className="text-blue-600 hover:underline font-bold">
                    info@taitataveta.go.ke
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Governor's Office</span>
                  <a href="mailto:governor@taitataveta.go.ke" className="text-blue-600 hover:underline font-bold">
                    governor@taitataveta.go.ke
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
              Response time within 24–48 hours
            </div>
          </div>

          {/* Card 4: Working Hours */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 border border-amber-100">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Office Working Hours</h3>
              <p className="text-xs text-gray-500 font-medium mb-3">Public Service Hours</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong className="text-gray-800">Weekdays:</strong> 8:00 AM – 5:00 PM</p>
                <p><strong className="text-gray-800">Weekends:</strong> Closed</p>
                <p><strong className="text-gray-800">Public Holidays:</strong> Closed</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-amber-700 font-bold flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              <span>24/7 Emergency Line Active</span>
            </div>
          </div>

        </div>

        {/* Google Maps Embed Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-green-900 to-green-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-green-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Navigation className="w-4 h-4" />
                <span>GPS Location & Map Guide</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">County Headquarters — Mwatate</h2>
              <p className="text-xs sm:text-sm text-green-100 mt-1">
                Located in Mwatate Sub-County, serving as the official administrative capital of Taita Taveta County.
              </p>
            </div>
            
            <a
              href="https://www.google.com/maps/search/?api=1&query=Taita+Taveta+County+Headquarters+Mwatate+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 self-start md:self-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Google Maps
            </a>
          </div>

          <div className="relative w-full h-[450px] sm:h-[500px] bg-gray-100">
            <iframe
              title="County Headquarters Mwatate Google Map"
              src="https://maps.google.com/maps?q=Taita%20Taveta%20County%20Headquarters,%20Mwatate,%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>

            {/* Floating Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 text-green-700 mr-1.5" />
                  Mwatate Headquarters
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-md">
                  Main HQ
                </span>
              </div>
              <p className="text-gray-600">
                Along Voi – Taveta Highway, Mwatate Town.
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-gray-500">
                <span>GPS: -3.5061° S, 38.3752° E</span>
                <a
                  href={`tel:${cleanPhone}`}
                  className="font-bold text-green-700 hover:underline"
                >
                  Call Desk
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-County Administration Directory */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sub-County Administrative Offices</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Decentralized service centers across Taita Taveta County for local citizen services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subCountyOffices.map((office, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-green-50 text-green-700 font-bold text-xs flex items-center justify-center border border-green-100">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-County</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{office.name}</h3>
                  <p className="text-xs text-gray-500 flex items-start">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1 shrink-0 mt-0.5" />
                    <span>{office.location}</span>
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 text-xs space-y-1">
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Tel:</strong>{' '}
                    <a href={`tel:${cleanPhone}`} className="text-green-700 hover:underline font-semibold">
                      {office.phone}
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Email:</strong>{' '}
                    <a href={`mailto:${office.email}`} className="text-blue-600 hover:underline font-semibold">
                      {office.email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Hotlines Bar */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-red-100 text-red-700 rounded-xl shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-950 text-base">Emergency Services & Disaster Hotlines</h3>
              <p className="text-xs text-red-800 mt-0.5">
                For immediate medical emergencies, fire outbreaks, or disaster relief response across Taita Taveta County.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${cleanPhone}`}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              County Line: {officialPhone}
            </a>
            <a
              href="tel:999"
              className="px-4 py-2 bg-red-950 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center"
            >
              National Emergency: 999 / 112
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

