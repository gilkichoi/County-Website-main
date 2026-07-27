import { ExternalLink, CheckCircle, Facebook } from 'lucide-react';

const FB_PAGE_URL = "https://web.facebook.com/TheTaitaTavetaCountyGovernment";

export function FacebookFeed({ maxPosts }: { maxPosts?: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
              <Facebook className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug flex items-center gap-1.5">
                Facebook Live Updates
                <CheckCircle className="w-4 h-4 text-blue-300 fill-blue-500" />
              </h3>
              <p className="text-xs text-blue-100">@TheTaitaTavetaCountyGovernment</p>
            </div>
          </div>
          <a
            href={FB_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 font-semibold text-xs rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
          >
            Visit Page <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Body Content - Official Page Plugin */}
      <div className="p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center min-h-[480px] bg-gray-50 rounded-xl border border-gray-200 p-1 overflow-hidden">
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
              FB_PAGE_URL
            )}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=`}
            width="100%"
            height="500"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook County Page Feed"
            className="w-full rounded-lg"
          ></iframe>
        </div>

        <div className="pt-3 text-center">
          <a
            href={FB_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors border border-blue-200/80"
          >
            <span>View Official Page on Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

