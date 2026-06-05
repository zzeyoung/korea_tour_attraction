'use client';

import Image from 'next/image';
import { forwardRef } from 'react';
import type { Character, CollectionStatus } from '@/lib/types';

interface Props {
  characters: Character[];
  statuses: Record<string, CollectionStatus>;
  nickname?: string;
}

const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { characters, statuses, nickname },
  ref
) {
  const visited = characters.filter(
    (c) => statuses[c.placeId]?.level === 'visited'
  );
  const discovered = characters.filter(
    (c) => statuses[c.placeId]?.level === 'discovered'
  );
  const total = characters.length;
  const progress = total > 0 ? (visited.length / total) * 100 : 0;

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-7 rounded-2xl"
      style={{ width: '360px' }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xl">🏯</span>
        <span className="text-xs font-bold tracking-wide text-stone-300">
          관광지 친구들
        </span>
      </div>
      <div className="text-[10px] text-stone-500 mb-6">
        한국의 장소와 대화하다
      </div>

      <div className="mb-5">
        <div className="text-[11px] text-stone-400 mb-1.5">
          {nickname ? `${nickname}의 발자국` : '나의 발자국'}
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-5xl font-bold tracking-tight bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
            {visited.length}
          </span>
          <span className="text-sm text-stone-400">/ {total} 곳 방문</span>
        </div>
        <div className="w-full h-1 bg-stone-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-amber-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Visited */}
      {visited.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] text-stone-500 mb-2 tracking-[0.15em]">
            VISITED · {visited.length}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {visited.slice(0, 8).map((c) => (
              <div
                key={c.placeId}
                className="relative aspect-[3/4] rounded-md overflow-hidden"
              >
                <Image
                  src={c.thumbnail}
                  alt={c.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discovered */}
      {discovered.length > 0 && (
        <div>
          <div className="text-[9px] text-stone-500 mb-2 tracking-[0.15em]">
            DISCOVERED · {discovered.length}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {discovered.slice(0, 4).map((c) => (
              <div
                key={c.placeId}
                className="relative aspect-[3/4] rounded-md overflow-hidden grayscale opacity-60"
              >
                <Image
                  src={c.thumbnail}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {visited.length === 0 && discovered.length === 0 && (
        <div className="py-8 text-center text-stone-500 text-xs">
          아직 만난 장소가 없어요
        </div>
      )}

      <div className="mt-5 pt-3 border-t border-stone-700/50 text-[9px] text-stone-500 text-center tracking-wider">
        TOUR-FRIENDS · 한국관광공사
      </div>
    </div>
  );
});

export default ShareCard;