'use client';
import { useState } from 'react';
import { Character } from '@/lib/types';
import { getCurrentPosition, getDistance } from '@/lib/geo';
import { updateCollectionStatus } from '@/lib/storage';

const VISIT_THRESHOLD = 500;  // 500m 이내면 방문 인증

export default function VisitButton({ character }: { character: Character }) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'fail'>('idle');
  
  const handleVisit = async () => {
    setStatus('checking');
    try {
      const position = await getCurrentPosition();
      const distance = getDistance(
        position.coords.latitude,
        position.coords.longitude,
        character.latitude,
        character.longitude
      );
      
      if (distance <= VISIT_THRESHOLD) {
        updateCollectionStatus(character.placeId, { 
          level: 'visited', 
          visitedAt: Date.now() 
        });
        setStatus('success');
      } else {
        setStatus('fail');
        alert(`현재 위치에서 ${Math.round(distance)}m 떨어져 있어요. ${character.name}에 가까이 가서 다시 시도해보세요.`);
      }
    } catch (e) {
      setStatus('fail');
      alert('위치 확인 실패. 권한을 허용해주세요.');
    }
  };
  
  if (status === 'success') {
    return <div className="text-green-600">✓ 방문 인증 완료!</div>;
  }
  
  return (
    <button onClick={handleVisit} disabled={status === 'checking'}>
      📍 방문하기
    </button>
  );
}