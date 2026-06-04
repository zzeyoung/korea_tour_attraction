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
  // 🔒 LOCKED: 실루엣
  if (status.level === 'locked') {
    return (
      <div className="aspect-[3/4] bg-stone-100 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="text-6xl mb-2 grayscale opacity-20 blur-[2px] select-none">
          {character.emoji}
        </div>
        <div className="text-xs font-medium text-stone-400 tracking-widest">
          ??? 
        </div>
        <div className="text-[10px] text-stone-300 mt-1">미발견</div>
        <div className="absolute top-2 right-2 text-stone-300">🔒</div>
      </div>
    );
  }

  // 💬 DISCOVERED: 흑백 + 이름 노출 + 채팅 가능
  if (status.level === 'discovered') {
    return (
      <Link
        href={`/chat/${character.placeId}`}
        className="group block aspect-[3/4] bg-white border border-stone-200 rounded-2xl p-4 flex flex-col text-center hover:shadow-md hover:border-stone-300 active:scale-[0.98] transition-all relative overflow-hidden"
      >
        <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-full font-medium">
          💬
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-5xl grayscale opacity-70 group-hover:opacity-90 transition-opacity">
            {character.emoji}
          </div>
        </div>
        <div className="font-bold text-stone-700 text-sm leading-tight">
          {character.name}
        </div>
        <div className="text-[10px] text-stone-400 mt-1 truncate">
          {character.region}
        </div>
        <div className="text-[10px] text-stone-400 mt-1.5 italic">
          아직 방문 전
        </div>
      </Link>
    );
  }

  // ✅ VISITED: 풀컬러 + 방문 인증 뱃지
  return (
    <Link
      href={`/chat/${character.placeId}`}
      className="group block aspect-[3/4] bg-gradient-to-br from-amber-50 via-white to-rose-50/60 border border-rose-200/50 rounded-2xl p-4 flex flex-col text-center hover:shadow-lg hover:border-rose-300/70 active:scale-[0.98] transition-all relative overflow-hidden shadow-sm"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
        <span>✓</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-5xl group-hover:scale-110 transition-transform">
          {character.emoji}
        </div>
      </div>
      <div className="font-bold text-stone-900 text-sm leading-tight">
        {character.name}
      </div>
      <div className="text-[10px] text-stone-500 mt-1 truncate">
        {character.mbti} · {character.region.split(' ')[0]}
      </div>
      {status.visitedAt && (
        <div className="text-[10px] text-emerald-700 font-medium mt-1.5">
          {formatDate(status.visitedAt)} 방문
        </div>
      )}
    </Link>
  );
}