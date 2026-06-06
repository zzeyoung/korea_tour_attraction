'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Character, CollectionStatus } from '@/lib/types';

interface Props {
  character: Character;
  status: CollectionStatus;
}

function formatDate(ts?: number) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export default function CollectionCard({ character, status }: Props) {
  // 공통: 카드 컨테이너
  const cardBase =
    'relative aspect-[3/4] rounded-2xl overflow-hidden transition-all';

  // 🔒 LOCKED — 단순한 ? 카드
  if (status.level === 'locked') {
    return (
      <div
        className={`${cardBase} bg-stone-100 border border-stone-200 flex items-center justify-center`}
      >
        <div className="text-4xl text-stone-300 font-light">?</div>
      </div>
    );
  }

  // 💬 DISCOVERED
  if (status.level === 'discovered') {
    return (
      <Link
        href={`/chat/${character.placeId}`}
        className={`group block ${cardBase} bg-white border border-stone-200 hover:shadow-md hover:border-stone-300 active:scale-[0.98]`}
      >
        {/* 카드 이미지 (흑백) */}
        <div className="absolute inset-0 grayscale opacity-90 group-hover:opacity-100 transition-opacity">
          <Image
            src={character.thumbnail}
            alt={character.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
          />
        </div>
        {/* 옅은 베일 */}
        <div className="absolute inset-0 bg-white/15" />
        {/* 상단 좌 — 발견 뱃지 */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-stone-600 shadow-sm">
          💬 발견
        </div>
      </Link>
    );
  }

  // ✓ VISITED
  return (
    <Link
      href={`/chat/${character.placeId}`}
      className={`group block ${cardBase} bg-white border-2 border-emerald-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 shadow-md`}
    >
      {/* 카드 이미지 (풀컬러) */}
      <div className="absolute inset-0">
        <Image
          src={character.thumbnail}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover"
          priority
        />
      </div>
      
      {/* 하단 — 방문 날짜 (그라데이션) */}
      {status.visitedAt && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2 px-3">
          <div className="text-[10px] font-bold text-white tracking-wide drop-shadow">
            {formatDate(status.visitedAt)} 방문
          </div>
        </div>
      )}
    </Link>
  );
}