// 캐릭터 친구 관계
export interface Friend {
  placeId: string;
  relation: string;
}

// 캐릭터 기본 정보 (characters.json 구조)
export interface Character {
  placeId: string;
  name: string;
  shortName?: string;
  region: string;
  emoji: string;
  thumbnail: string;
  mbti: string;
  age: string;
  tagline: string;
  latitude: number;
  longitude: number;
  friends: Friend[];
}

export type CharactersData = Record<string, Character>;

// 채팅 메시지
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  recommendedFriends?: string[];
}

// 도감 상태
export type CollectionLevel = 'locked' | 'discovered' | 'visited';

export interface CollectionStatus {
  placeId: string;
  level: CollectionLevel;
  firstChatAt?: number;
  visitedAt?: number;
}