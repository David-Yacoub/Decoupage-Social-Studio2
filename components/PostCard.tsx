import React, { useState } from 'react';
import { GeneratedPost, SocialPlatform } from '../types';
import { Copy, Check, Instagram, Facebook, Twitter, Video, Share2 } from 'lucide-react';

interface PostCardProps {
  post: GeneratedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `${post.content}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-600" />;
    if (p.includes('facebook')) return <Facebook className="w-5 h-5 text-blue-600" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-5 h-5 text-black" />;
    if (p.includes('tiktok')) return <Video className="w-5 h-5 text-black" />; // Using Video icon for TikTok
    if (p.includes('pinterest')) return <Share2 className="w-5 h-5 text-red-600" />; // Generic share for Pinterest
    return <Share2 className="w-5 h-5 text-gray-600" />;
  };

  const getBgColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'bg-pink-50 border-pink-100';
    if (p.includes('facebook')) return 'bg-blue-50 border-blue-100';
    if (p.includes('twitter')) return 'bg-gray-50 border-gray-200';
    if (p.includes('tiktok')) return 'bg-slate-50 border-slate-200';
    if (p.includes('pinterest')) return 'bg-red-50 border-red-100';
    return 'bg-white border-gray-100';
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${getBgColor(post.platform)}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white rounded-full shadow-sm">
            {getIcon(post.platform)}
          </div>
          <h3 className="font-semibold text-gray-800">{post.platform}</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed font-sans">
          {post.content}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag, idx) => (
            <span key={idx} className="text-xs text-blue-600 bg-white px-2 py-1 rounded border border-blue-50">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
