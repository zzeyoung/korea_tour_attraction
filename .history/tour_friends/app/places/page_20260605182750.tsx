import Link from 'next/link';
import charactersData from '@/data/characters.json';
import type { CharactersData } from '@/lib/types';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';

const characters = charactersData as CharactersData;

export default function PlacesPage() {
  const list = Object.values(characters);

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            관광지 캐릭터
          </h1>
          <p className="text-stone-500 mt-2">
            한국의 장소들과 대화를 시작해보세요 · 총 {list.length}곳
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {list.map((c) => (
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
      </div>

      <BottomNav />
    </div>
  );
}