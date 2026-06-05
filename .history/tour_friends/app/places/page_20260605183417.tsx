'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import charactersData from '@/data/characters.json';
import type { CharactersData } from '@/lib/types';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import RegionFilter from '@/components/RegionFilter';
import {
  getAllProvinces,
  getCitiesByProvince,
  filterByRegion,
  parseRegion,
} from '@/lib/region';

const characters = charactersData as CharactersData;

export default function PlacesPage() {
  const allList = useMemo(() => Object.values(characters), []);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const provinces = useMemo(() => getAllProvinces(allList), [allList]);
  const cities = useMemo(
    () => (selectedProvince ? getCitiesByProvince(allList, selectedProvince) : []),
    [allList, selectedProvince]
  );

  const filtered = useMemo(
    () => filterByRegion(allList, selectedProvince, selectedCity),
    [allList, selectedProvince, selectedCity]
  );

  // 카운트 (전체/시도별/시군구별)
  const counts = useMemo(() => {
    const province: Record<string, number> = {};
    const city: Record<string, number> = {};
    for (const c of allList) {
      const p = parseRegion(c.region);
      province[p.province] = (province[p.province] ?? 0) + 1;
    }
    if (selectedProvince) {
      for (const c of allList) {
        const p = parseRegion(c.region);
        if (p.province === selectedProvince && p.city) {
          city[p.city] = (city[p.city] ?? 0) + 1;
        }
      }
    }
    return { province, city, all: allList.length };
  }, [allList, selectedProvince]);

  const isFiltered = selectedProvince !== null || selectedCity !== null;

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            관광지 캐릭터
          </h1>
          <p className="text-stone-500 mt-2">
            한국의 장소들과 대화를 시작해보세요
          </p>
        </header>

        {/* 필터 */}
        <div className="mb-7">
          <RegionFilter
            provinces={provinces}
            cities={cities}
            selectedProvince={selectedProvince}
            selectedCity={selectedCity}
            onProvinceChange={setSelectedProvince}
            onCityChange={setSelectedCity}
            counts={counts}
          />
        </div>

        {/* 결과 카운트 + 초기화 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-stone-500">
            <span className="font-medium text-stone-700">{filtered.length}</span>개의 장소
            {isFiltered && (
              <>
                <span className="mx-2 text-stone-300">·</span>
                <span>
                  {selectedProvince}
                  {selectedCity && ` ${selectedCity}`}
                </span>
              </>
            )}
          </div>
          {isFiltered && (
            <button
              onClick={() => {
                setSelectedProvince(null);
                setSelectedCity(null);
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 캐릭터 그리드 / 빈 상태 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl">
            <div className="text-5xl mb-3 grayscale opacity-50">🏞️</div>
            <div className="text-stone-700 text-sm font-medium mb-1">
              이 지역에는 아직 캐릭터가 없어요
            </div>
            <div className="text-stone-400 text-xs">
              다른 지역을 선택해보세요
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((c) => (
              <Link
                key={c.placeId}
                href={`/chat/${c.placeId}`}
                className="group bg-white border border-stone-200 rounded-2xl p-4 md:p-5 hover:shadow-md hover:border-stone-300 active:scale-[0.98] transition-all"
              >
                <div className="text-4xl md:text-5xl mb-3">{c.emoji}</div>
                <div className="font-bold text-stone-900 mb-0.5">{c.name}</div>
                <div className="text-[11px] text-stone-500 mb-2">
                  {c.region} · {c.mbti}
                </div>
                <div className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {c.tagline}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}