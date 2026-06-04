'use client';

import { useState, useEffect } from 'react';
import type { Character } from '@/lib/types';
import {
  calculateDistance,
  formatDistance,
  getCurrentPosition,
} from '@/lib/geo';
import { getCollectionStatus, markAsVisited } from '@/lib/storage';

const VISIT_THRESHOLD_METERS = 500;

interface Props {
  character: Character;
  onVisited?: () => void;
}

type Status =
  | 'idle'
  | 'checking'
  | 'success'
  | 'too-far'
  | 'denied'
  | 'visited';

export default function VisitButton({ character, onVisited }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = getCollectionStatus(character.placeId);
    if (s.level === 'visited') setStatus('visited');
    setHydrated(true);
  }, [character.placeId]);

  async function handleVisit() {
    setStatus('checking');
    setDistance(null);

    try {
      const pos = await getCurrentPosition();
      const dist = calculateDistance(
        pos.latitude,
        pos.longitude,
        character.latitude,
        character.longitude
      );
      setDistance(dist);

      if (dist <= VISIT_THRESHOLD_METERS) {
        markAsVisited(character.placeId);
        setStatus('success');
        onVisited?.();
      } else {
        setStatus('too-far');
      }
    } catch (err) {
      console.error('[VisitButton] geolocation error:', err);
      setStatus('denied');
    }
  }

  if (!hydrated) return null;

  // 이미 방문 완료 (영구) 또는 방금 성공
  if (status === 'visited' || status === 'success') {
    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-medium ${
          status === 'success' ? 'animate-pulse' : ''
        }`}
      >
        <span>✓</span>
        <span>방문 완료</span>
      </div>
    );
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full text-stone-500 text-xs font-medium">
        <span className="inline-block w-2 h-2 bg-stone-400 rounded-full animate-pulse" />
        위치 확인 중
      </div>
    );
  }

  if (status === 'too-far' && distance !== null) {
    return (
      <button
        onClick={handleVisit}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
        title={`${formatDistance(distance)} 거리에 있어요. 더 가까이 가서 다시 시도.`}
      >
        <span>📍</span>
        <span>{formatDistance(distance)} 멀어요</span>
      </button>
    );
  }

  if (status === 'denied') {
    return (
      <button
        onClick={handleVisit}
        className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors"
      >
        위치 권한 필요
      </button>
    );
  }

  // idle
  return (
    <button
      onClick={handleVisit}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-full text-xs font-medium hover:bg-rose-700 active:scale-95 transition-all shadow-sm"
    >
      <span>📍</span>
      <span>방문하기</span>
    </button>
  );
}