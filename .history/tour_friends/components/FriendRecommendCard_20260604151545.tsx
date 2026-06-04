'use client';

import Link from 'next/link';
import type { Character } from '@/lib/types';

interface Props {
  friend: Character;
  relation: string;
}

export default function FriendRecommendCard({ friend, relation }: Props) {
  return (
    <Link href={`/chat/${friend.placeId}`} className="block group">
      <div className="bg-gradient-to-br from-amber-50 to-rose-50/70 border border-rose-200/60 rounded-2xl p-4 transition-all group-hover:shadow-md group-hover:border-rose-300/80 group-active:scale-[0.98]">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-xs">✨</span>
          <span className="text-xs font-medium text-rose-700 tracking-wide">
            {relation}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-4xl shrink-0">{friend.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-stone-900 truncate">
              {friend.name}
            </div>
            <div className="text-xs text-stone-500 truncate">
              {friend.region} · {friend.mbti}
            </div>
          </div>
          <div className="text-stone-400 text-lg shrink-0 group-hover:translate-x-0.5 transition-transform">
            →
          </div>
        </div>
        <div className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
          {friend.tagline}
        </div>
      </div>
    </Link>
  );
}