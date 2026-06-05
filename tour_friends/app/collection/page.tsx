'use client';

import { useEffect, useState } from 'react';
import charactersData from '@/data/characters.json';
import type { CharactersData, CollectionStatus } from '@/lib/types';
import { getAllCollectionStatuses } from '@/lib/storage';
import CollectionCard from '@/components/CollectionCard';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';

const characters = charactersData as CharactersData;

export default function CollectionPage() {
  const [statuses, setStatuses] = useState<Record<string, CollectionStatus>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const placeIds = Object.keys(characters);
    const map = getAllCollectionStatuses(placeIds);
    setStatuses(map);
    setHydrated(true);
  }, []);

  const list = Object.values(characters);
  const visited = list.filter(c => statuses[c.placeId]?.level === 'visited').length;
  const discovered = list.filter(c => statuses[c.placeId]?.level === 'discovered').length;

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="bg-stone-900 text-white rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-400 mb-1">나의 발자국</div>
            <div className="text-3xl font-bold">{visited}<span className="text-base font-normal text-stone-400 ml-1">곳</span></div>
            <div className="w-48 bg-stone-700 rounded-full h-1.5 mt-3">
              <div className="bg-rose-500 h-1.5 rounded-full transition-all" style={{width: `${(visited/list.length)*100}%`}} />
            </div>
          </div>
          <div className="text-right text-sm text-stone-400">
            <div>{visited} / {list.length} 방문</div>
            <div>발견 {discovered}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {list.map(c => (
            <CollectionCard
              key={c.placeId}
              character={c}
              status={statuses[c.placeId] ?? { placeId: c.placeId, level: 'locked' }}
            />
          ))}
        </div>

        <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-4 text-sm text-stone-600">
          <div className="font-medium text-stone-900 mb-3">도감 단계</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><span>🔒</span><span><b>미발견</b> · 아직 만나지 않은 장소</span></div>
            <div className="flex items-center gap-2"><span>💬</span><span><b>발견</b> · 대화를 나눈 장소</span></div>
            <div className="flex items-center gap-2"><span>✓</span><span><b>방문</b> · 실제로 방문 인증한 장소</span></div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}