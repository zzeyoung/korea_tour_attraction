'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Character, CollectionStatus } from '@/lib/types';

interface Props {
  character: Character;
  status: CollectionStatus;
}

export default function CollectionCard({ character, status }: Props) {
  const cardBase =
    'relative aspect-[3/4] rounded-2xl overflow-hidden transition-all';

  // 🔒 LOCKED — 강한 블러 + 자물쇠
  if (status.level === 'locked') {
    return (
      <div className={`${cardBase} bg-stone-100 border border-stone-200`}>
        <div className="absolute inset-0 blur-2xl opacity-30 grayscale">
          <Image
            src={character.thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-stone-200/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl mb-1.5 opacity-40">🔒</div>
          <div className="text-[10px] font-bold text-stone-400 tracking-[0.2em]">
            LOCKED
          </div>
        </div>
      </div>
    );
  }

  // 💬 DISCOVERED — 흑백
  if (status.level === 'discovered') {
    return (
      <Link
        href={`/chat/${character.placeId}`}
        className={`group block ${cardBase} bg-white border border-stone-200 hover:shadow-md hover:border-stone-300 active:scale-[0.98]`}
      >
        <div className="absolute inset-0 grayscale opacity-90 group-hover:opacity-100 transition-opacity">
          <Image
            src={character.thumbnail}
            alt={character.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-white/15" />
      </Link>
    );
  }

  // ✓ VISITED — 풀컬러, 미니멀 (체크 뱃지 X)
  return (
    <Link
      href={`/chat/${character.placeId}`}
      className={`group block ${cardBase} bg-white border border-stone-200 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 shadow-sm`}
    >
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
    </Link>
  );
}