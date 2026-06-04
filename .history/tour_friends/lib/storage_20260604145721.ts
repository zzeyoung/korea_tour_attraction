import type { ChatMessage, CollectionStatus, CollectionLevel } from './types';

// ============ 채팅 히스토리 ============

export function getChatHistory(placeId: string): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(`chat_${placeId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(placeId: string, messages: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`chat_${placeId}`, JSON.stringify(messages));
}

export function clearChatHistory(placeId: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`chat_${placeId}`);
}

// ============ 도감 상태 ============

export function getCollectionStatus(placeId: string): CollectionStatus {
  if (typeof window === 'undefined') {
    return { placeId, level: 'locked' };
  }
  try {
    const data = localStorage.getItem(`collection_${placeId}`);
    if (!data) return { placeId, level: 'locked' };
    return JSON.parse(data);
  } catch {
    return { placeId, level: 'locked' };
  }
}

export function setCollectionLevel(
  placeId: string,
  level: CollectionLevel,
  extra: Partial<CollectionStatus> = {}
) {
  if (typeof window === 'undefined') return;
  const current = getCollectionStatus(placeId);
  
  // 한번 visited되면 discovered로 되돌아가지 않게 보호
  if (current.level === 'visited' && level !== 'visited') return;
  
  const updated: CollectionStatus = { ...current, ...extra, placeId, level };
  localStorage.setItem(`collection_${placeId}`, JSON.stringify(updated));
}

// 첫 대화 시 호출
export function markAsDiscovered(placeId: string) {
  const status = getCollectionStatus(placeId);
  if (status.level === 'locked') {
    setCollectionLevel(placeId, 'discovered', { firstChatAt: Date.now() });
  }
}

// GPS 인증 성공 시 호출
export function markAsVisited(placeId: string) {
  setCollectionLevel(placeId, 'visited', { visitedAt: Date.now() });
}

// 모든 도감 상태 일괄 조회 (도감 페이지용)
export function getAllCollectionStatuses(placeIds: string[]): Record<string, CollectionStatus> {
  const result: Record<string, CollectionStatus> = {};
  for (const id of placeIds) {
    result[id] = getCollectionStatus(id);
  }
  return result;
}