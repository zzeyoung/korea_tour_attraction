'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import charactersData from '@/data/characters.json';
import type { CharactersData } from '@/lib/types';
import { decodeSnapshot, snapshotToStatuses } from '@/lib/share';
import CollectionCard from '@/components/CollectionCard';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import {
  getAllProvinces,
  getCitiesByProvince,
  filterByRegion,
  parseRegion,
} from '@/lib/region';
import { useState } from 'react';

const characters = charactersData as CharactersData;

export default function SharedPage() {
  const params = useParams();
  const encoded = params.snapshot as string;
  const snapshot = useMemo(() => decodeSnapshot(encoded), [encoded]);
  const statuses = useMemo(
    () => (snapshot ? snapshotToStatuses(snapshot) : {}),
    [snapshot]
  );

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const allCharacters = useMemo(() => Object.values(characters), []);
  const provinces = useMemo(
    () => getAllProvinces(allCharacters),
    [allCharacters]
  );
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

  // 디코딩 실패
  if (!snapshot) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <TopNav />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">🔗</div>
            <div className="font-bold text-stone-900 mb-2">
              잘못된 공유 링크
            </div>
            <div className="text-sm text-stone-500 mb-6">
              링크가 손상되었거나 만료되었어요.
            </div>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = allCharacters.length;
  const visitedCount = snapshot.vi.length;
  const discoveredCount = snapshot.d.length + snapshot.vi.length;
  const progress = total > 0 ? (visitedCount / total) * 100 : 0;
  const sharedAt = new Date(snapshot.t);

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        {/* Read-only 알림 + 닉네임 */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-700">
          <span>👀</span>
          <span>공유받은 도감 · 읽기 전용</span>
        </div>

        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            {snapshot.n ? `${snapshot.n}의 발자국` : '누군가의 발자국'}
          </h1>
          <p className="text-stone-500 mt-2 text-sm">
            {sharedAt.getFullYear()}.{sharedAt.getMonth() + 1}.
            {sharedAt.getDate()} 공유됨
          </p>
        </header>

        {/* 진행도 카드 */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-700 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-sm font-medium text-stone-300">방문한 곳</div>
            <div className="text-xs text-stone-400">
              {visitedCount} / {total} 방문
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-5xl font-bold tracking-tight">
              {visitedCount}
            </span>
            <span className="text-lg text-stone-400">곳</span>
            <span className="text-xs text-stone-500 ml-auto">
              발견 {discoveredCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mb-8 p-5 bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 rounded-2xl flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1">
            <div className="font-bold text-stone-900 mb-0.5">
              나도 도감을 채워볼까?
            </div>
            <div className="text-xs text-stone-600">
              한국의 관광지 캐릭터와 대화하고, 직접 방문하면 컬러가 풀려요
            </div>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 active:scale-95 transition-all whitespace-nowrap text-center"
          >
            시작하기 →
          </Link>
        </div>

        {/* 시/도 칩 */}
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

        {/* 시/군/구 */}
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
      </div>

      <BottomNav />
    </div>
  );
}