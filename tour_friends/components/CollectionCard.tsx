'use client';

import Link from 'next/link';
import type { Character, CollectionStatus } from '@/lib/types';

interface Props {
  character: Character;
  status: CollectionStatus;
}

function formatDate(timestamp?: number) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export default function CollectionCard({ character, status }: Props) {
  // 🔒 LOCKED: 미발견
  if (status.level === 'locked') {
  return (
    <div className="aspect-[3/4] bg-stone-100 border border-stone-200 rounded-2xl flex flex-col items-center justify-center relative">
      <div className="absolute top-2 right-2 text-stone-300">🔒</div>
      <div className="text-6xl mb-2 grayscale opacity-20 blur-[2px] select-none">
        {character.emoji}
      </div>
      <div className="text-xs font-medium text-stone-400 tracking-widest">???</div>
      <div className="text-[10px] text-stone-300 mt-1">미발견</div>
    </div>
  );
}

  // 💬 DISCOVERED: 흑백
  if (status.level === 'discovered') {
    return (
      <Link
        href={`/chat/${character.placeId}`}
        className="group block aspect-[3/4] rounded-2xl overflow-hidden relative hover:shadow-md active:scale-[0.98] transition-all"
      >
        <img
          src={character.thumbnail}
          alt={character.name}
          className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-white/80 text-stone-500 rounded-full font-medium">
          💬
        </div>
      </Link>
    );
  }

  // ✅ VISITED: 풀컬러
  return (
    <Link
      href={`/chat/${character.placeId}`}
      className="group block aspect-[3/4] rounded-2xl overflow-hidden relative hover:shadow-lg active:scale-[0.98] transition-all"
    >
      <img
        src={character.thumbnail}
        alt={character.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
        ✓
      </div>
      {status.visitedAt && (
        <div className="absolute bottom-2 left-2 text-[10px] text-emerald-700 font-medium bg-white/80 px-1.5 py-0.5 rounded-full">
          {formatDate(status.visitedAt)} 방문
        </div>
      )}
    </Link>
  );
}