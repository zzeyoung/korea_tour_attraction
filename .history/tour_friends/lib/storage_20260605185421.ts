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


import type { GuestbookEntry } from './types';

// ============ 방명록 ============

export function getGuestbookEntries(placeId: string): GuestbookEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(`guestbook_${placeId}`);
    const arr: GuestbookEntry[] = data ? JSON.parse(data) : [];
    return arr.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function addGuestbookEntry(
  placeId: string,
  entry: Omit<GuestbookEntry, 'id' | 'placeId' | 'createdAt'>
): GuestbookEntry {
  const newEntry: GuestbookEntry = {
    ...entry,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    placeId,
    createdAt: Date.now(),
  };
  const existing = getGuestbookEntries(placeId);
  const updated = [newEntry, ...existing];
  try {
    localStorage.setItem(`guestbook_${placeId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('[guestbook] save failed (quota?):', e);
    throw new Error('저장 공간이 부족합니다. 사진을 줄여보세요.');
  }
  return newEntry;
}

export function deleteGuestbookEntry(placeId: string, entryId: string) {
  const existing = getGuestbookEntries(placeId);
  const updated = existing.filter((e) => e.id !== entryId);
  localStorage.setItem(`guestbook_${placeId}`, JSON.stringify(updated));
}

export function getGuestbookCount(placeId: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const data = localStorage.getItem(`guestbook_${placeId}`);
    return data ? (JSON.parse(data) as GuestbookEntry[]).length : 0;
  } catch {
    return 0;
  }
}