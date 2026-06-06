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
    setStatuses(getAllCollectionStatuses(Object.keys(characters)));
    setHydrated(true);
  }, []);

  const allCharacters = Object.values(characters);
  const total = allCharacters.length;

  const discoveredCount = hydrated
    ? allCharacters.filter(
        (c) =>
          statuses[c.placeId]?.level === 'discovered' ||
          statuses[c.placeId]?.level === 'visited'
      ).length
    : 0;

  const visitedCount = hydrated
    ? allCharacters.filter((c) => statuses[c.placeId]?.level === 'visited').length
    : 0;

  const progress = total > 0 ? (visitedCount / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            도감
          </h1>
          <p className="text-stone-500 mt-2">
            한국의 장소들을 만나고 모아보세요
          </p>
        </header>

        {/* 진행도 카드 */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-700 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-sm font-medium text-stone-300">나의 발자국</div>
            <div className="text-xs text-stone-400">
              {hydrated ? `${visitedCount} / ${total} 방문` : '...'}
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-5xl font-bold tracking-tight">
              {hydrated ? visitedCount : 0}
            </span>
            <span className="text-lg text-stone-400">곳</span>
            <span className="text-xs text-stone-500 ml-auto">
              발견 {hydrated ? discoveredCount : 0}
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 캐릭터 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {allCharacters.map((c) => (
            <CollectionCard
              key={c.placeId}
              character={c}
              status={
                statuses[c.placeId] ?? { placeId: c.placeId, level: 'locked' }
              }
            />
          ))}
        </div>

        {/* 안내 */}
        <div className="mt-10 p-5 bg-white border border-stone-200 rounded-2xl max-w-2xl">
          <div className="text-xs font-bold text-stone-700 mb-3 tracking-wide">
            도감 단계
          </div>
          <ul className="space-y-2 text-xs text-stone-600">
            <li className="flex items-center gap-2">
              <span>🔒</span>
              <span className="text-stone-500">
                <b className="text-stone-700">미발견</b> · 아직 만나지 않은 장소
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>💬</span>
              <span className="text-stone-500">
                <b className="text-stone-700">발견</b> · 대화를 나눈 장소
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span className="text-stone-500">
                <b className="text-stone-700">방문</b> · 실제로 방문 인증한 장소
              </span>
            </li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}