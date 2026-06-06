'use client';

import { useEffect, useMemo, useState } from 'react';
import charactersData from '@/data/characters.json';
import type { CharactersData, CollectionStatus } from '@/lib/types';
import { getAllCollectionStatuses } from '@/lib/storage';
import CollectionCard from '@/components/CollectionCard';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import ShareModal from '@/components/ShareModal';
import {
  getAllProvinces,
  getCitiesByProvince,
  filterByRegion,
  parseRegion,
} from '@/lib/region';

const characters = charactersData as CharactersData;

export default function CollectionPage() {
  const [statuses, setStatuses] = useState<Record<string, CollectionStatus>>(
    {}
  );
  const [hydrated, setHydrated] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setStatuses(getAllCollectionStatuses(Object.keys(characters)));
    setHydrated(true);
  }, []);

  const allCharacters = useMemo(() => Object.values(characters), []);
  const total = allCharacters.length;

  const discoveredCount = hydrated
    ? allCharacters.filter(
        (c) =>
          statuses[c.placeId]?.level === 'discovered' ||
          statuses[c.placeId]?.level === 'visited'
      ).length
    : 0;

  const visitedCount = hydrated
    ? allCharacters.filter((c) => statuses[c.placeId]?.level === 'visited')
        .length
    : 0;

  const progress = total > 0 ? (visitedCount / total) * 100 : 0;

  // 필터링
  const provinces = useMemo(() => getAllProvinces(allCharacters), [allCharacters]);
  const cities = useMemo(
    () =>
      selectedProvince
        ? getCitiesByProvince(allCharacters, selectedProvince)
        : [],
    [allCharacters, selectedProvince]
  );
  const filtered = useMemo(
    () => filterByRegion(allCharacters, selectedProvince, selectedCity),
    [allCharacters, selectedProvince, selectedCity]
  );

  

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-8 md:mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              도감
            </h1>
            <p className="text-stone-500 mt-2">
              한국의 장소들을 만나고 모아보세요
            </p>
          </div>
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 hover:border-stone-300 hover:shadow-sm active:scale-95 transition-all shrink-0"
          >
            <span>📤</span>
            <span>공유</span>
          </button>
        </header>

        {/* 진행도 카드 */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-700 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-sm font-medium text-stone-300">
              나의 발자국
            </div>
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

       {/* 시/도 칩 필터 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedProvince(null);
              setSelectedCity(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
              !selectedProvince
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            전체
          </button>
          {provinces.map((p) => (
            <button
              key={p}
              onClick={() => {
                setSelectedProvince(p);
                setSelectedCity(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                selectedProvince === p
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* 시/군/구 칩 (시/도 선택 시) */}
        {selectedProvince && cities.length > 0 && (
          <div className="mb-6 pl-3 border-l-2 border-rose-200 flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCity(null)}
              className={`px-3 py-1 rounded-full text-xs transition-all active:scale-95 ${
                !selectedCity
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-200'
              }`}
            >
              모두
            </button>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1 rounded-full text-xs transition-all active:scale-95 ${
                  selectedCity === c
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((c) => (
            <CollectionCard
              key={c.placeId}
              character={c}
              status={
                statuses[c.placeId] ?? {
                  placeId: c.placeId,
                  level: 'locked',
                }
              }
            />
          ))}
        </div>

        {/* 빈 상태 */}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
            <div className="text-stone-400 text-sm">
              이 지역에는 아직 카드가 없어요
            </div>
          </div>
        )}

        {/* 안내 */}
        <div className="mt-12 p-5 bg-white border border-stone-200 rounded-2xl max-w-2xl">
          <div className="text-xs font-bold text-stone-700 mb-3 tracking-wide">
            도감 단계
          </div>
          <ul className="space-y-2 text-xs text-stone-600">
            <li className="flex items-center gap-2">
              <span>❓</span>
              <span className="text-stone-500">
                <b className="text-stone-700">미발견</b> · 아직 만나지 않은 장소
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>🖤</span>
              <span className="text-stone-500">
                <b className="text-stone-700">발견</b> · 대화를 나눈 장소 (흑백)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>🎨</span>
              <span className="text-stone-500">
                <b className="text-stone-700">방문</b> · 실제로 방문 인증한 장소
                (컬러)
              </span>
            </li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}