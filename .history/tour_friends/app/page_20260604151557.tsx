'use client';

import Link from 'next/link';
import charactersData from '@/data/characters.json';
import type { CharactersData } from '@/lib/types';

const characters = charactersData as CharactersData;

export default function HomePage() {
  const list = Object.values(characters);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-5 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            관광지 친구들
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            한국의 장소와 대화해보세요
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {list.map((c) => (
            <Link
              key={c.placeId}
              href={`/chat/${c.placeId}`}
              className="group bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-stone-300 active:scale-[0.98] transition-all"
            >
              <div className="text-5xl mb-3">{c.emoji}</div>
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
      </div>
    </div>
  );
}