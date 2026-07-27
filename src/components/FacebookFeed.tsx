import { useState } from 'react';
import { ExternalLink, ThumbsUp, MessageSquare, Share2, CheckCircle, RefreshCw, Facebook } from 'lucide-react';

export interface FacebookPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  postUrl: string;
}

const FB_PAGE_URL = "https://web.facebook.com/TheTaitaTavetaCountyGovernment";

export const initialFacebookPosts: FacebookPost[] = [
  {
    id: "fb-1",
    author: "The Taita Taveta County Government",
    handle: "@TheTaitaTavetaCountyGovernment",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80",
    timestamp: "2 hours ago",
    content: "H.E. Governor Andrew Mwadime today inspected the ongoing construction of the Voi Modern Market. The project is 85% complete and will accommodate over 1,200 local traders upon completion, boosting the regional economy. #TaitaTaveta #Development #VoiMarket",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80",
    likes: 342,
    comments: 48,
    shares: 29,
    postUrl: FB_PAGE_URL
  },
  {
    id: "fb-2",
    author: "The Taita Taveta County Government",
    handle: "@TheTaitaTavetaCountyGovernment",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80",
    timestamp: "Yesterday at 10:15 AM",
    content: "📢 PUBLIC PARTICIPATION NOTICE: All residents are invited to attend the FY 2026/2027 County Budget Public Participation forums across all 20 wards starting next Monday. Your voice matters in shaping our county's priorities!",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    likes: 520,
    comments: 89,
    shares: 114,
    postUrl: FB_PAGE_URL
  },
  {
    id: "fb-3",
    author: "The Taita Taveta County Government",
    handle: "@TheTaitaTavetaCountyGovernment",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80",
    timestamp: "July 24 at 3:30 PM",
    content: "Healthcare Milestone: The Department of Health Services has today flagged off Ksh 45 Million worth of essential pharmaceuticals and medical supplies to all 68 health facilities in Taveta, Mwatate, Voi, and Wundanyi.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
    likes: 612,
    comments: 73,
    shares: 55,
    postUrl: FB_PAGE_URL
  }
];

export function FacebookFeed({ maxPosts = 3 }: { maxPosts?: number }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'embed'>('feed');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<FacebookPost[]>(initialFacebookPosts);

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const isLiked = !prev[id];
      setPosts(currentPosts => currentPosts.map(p => {
        if (p.id === id) {
          return { ...p, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white">
        <div className="flex items-center justify-between mb-2">
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

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'feed'
                ? 'bg-white text-blue-800 shadow-sm'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            Latest Posts
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'embed'
                ? 'bg-white text-blue-800 shadow-sm'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            Official Page Plugin
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5">
        {activeTab === 'feed' ? (
          <div className="space-y-5">
            {posts.slice(0, maxPosts).map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <div
                  key={post.id}
                  className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/80 hover:border-blue-200 transition-colors"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 text-white">
                          <Facebook className="w-2.5 h-2.5 fill-current" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900 text-sm leading-tight hover:underline cursor-pointer">
                            {post.author}
                          </span>
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600 fill-blue-100 shrink-0" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Text */}
                  <p className="text-gray-800 text-xs sm:text-sm mb-3 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <div className="rounded-lg overflow-hidden mb-3 border border-gray-200/60 max-h-56">
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Post Interactions */}
                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors ${
                        isLiked ? 'text-blue-600 font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-blue-600' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments} comments</span>
                    </a>

                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{post.shares}</span>
                    </a>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 text-center">
              <a
                href={FB_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors border border-blue-200/80"
              >
                <span>View More on Facebook Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[420px] bg-gray-50 rounded-xl border border-gray-200 p-2 overflow-hidden">
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                FB_PAGE_URL
              )}&tabs=timeline&width=380&height=480&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=`}
              width="100%"
              height="480"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Facebook County Page Feed"
              className="w-full rounded-lg"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
