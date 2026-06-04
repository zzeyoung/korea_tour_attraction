// 채팅 히스토리
export function getChatHistory(placeId: string): ChatMessage[] {
  const data = localStorage.getItem(`chat_${placeId}`);
  return data ? JSON.parse(data) : [];
}

export function saveChatHistory(placeId: string, messages: ChatMessage[]) {
  localStorage.setItem(`chat_${placeId}`, JSON.stringify(messages));
}

// 도감 상태
export function getCollectionStatus(placeId: string): CollectionStatus {
  const data = localStorage.getItem(`collection_${placeId}`);
  return data ? JSON.parse(data) : { placeId, level: 'locked' };
}

export function updateCollectionStatus(placeId: string, status: Partial<CollectionStatus>) {
  const current = getCollectionStatus(placeId);
  const updated = { ...current, ...status };
  localStorage.setItem(`collection_${placeId}`, JSON.stringify(updated));
}

export function getAllCollectionStatus(): CollectionStatus[] {
  // 6개 다 불러오기
}