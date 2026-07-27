import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X, ExternalLink, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

export function EmergencyAlertBanner() {
  const { emergencyAlert } = useData();
  const [dismissed, setDismissed] = useState(false);

  if (!emergencyAlert || !emergencyAlert.enabled || dismissed) {
    return null;
  }

  const { title, message, type, linkUrl, linkText } = emergencyAlert;

  // Determine styling based on alert type
  let bgGradient = 'bg-gradient-to-r from-red-700 via-red-600 to-rose-700';
  let borderColor = 'border-red-800';
  let textColor = 'text-white';
  let badgeBg = 'bg-white/20 text-white';
  let buttonBg = 'bg-white text-red-700 hover:bg-red-50';
  let IconComponent = AlertTriangle;

  if (type === 'warning') {
    bgGradient = 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600';
    borderColor = 'border-amber-700';
    badgeBg = 'bg-black/20 text-white';
    buttonBg = 'bg-gray-900 text-amber-300 hover:bg-black';
    IconComponent = AlertCircle;
  } else if (type === 'info') {
    bgGradient = 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800';
    borderColor = 'border-blue-800';
    badgeBg = 'bg-white/20 text-white';
    buttonBg = 'bg-white text-blue-800 hover:bg-blue-50';
    IconComponent = Info;
  }

  return (
    <div className={`${bgGradient} text-white border-b ${borderColor} relative z-50 shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pr-8">
          <div className="flex items-start sm:items-center space-x-3">
            <div className={`p-1.5 rounded-lg shrink-0 ${badgeBg} mt-0.5 sm:mt-0 animate-pulse`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 text-white">
                  EMERGENCY ALERT
                </span>
                <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                  {title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-0.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {linkUrl && (
            <div className="shrink-0 pt-1 sm:pt-0">
              {linkUrl.startsWith('http') ? (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-sm ${buttonBg}`}
                >
                  <span>{linkText || 'More Information'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  to={linkUrl}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-sm ${buttonBg}`}
                >
                  <span>{linkText || 'More Information'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss Alert"
          className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
