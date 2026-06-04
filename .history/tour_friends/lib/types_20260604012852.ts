// 캐릭터 정보
export interface Character {
  placeId: string;
  name: string;
  shortName?: string;          // 짧은 이름 (정동심곡 바다부채길 → 정동심곡)
  region: string;              // "서울 종로구"
  emoji: string;               // 🏯 (도감에서 사용)
  thumbnail: string;           // 이미지 경로
  mbti: string;                // "INFJ"
  age: string;                 // "630살"
  tagline: string;             // 한 줄 소개
  latitude: number;            // GPS 위도
  longitude: number;           // GPS 경도
  friends: {                   // 친구 관계 (친구 추천 카드용)
    placeId: string;
    relation: string;          // "가장 친한 친구", "선의의 라이벌" 등
  }[];
  personaCard: string;         // 시스템 프롬프트에 주입할 카드 전문
}

// 채팅 메시지
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  recommendedFriends?: string[];  // 친구 추천 카드 표시용 (placeId 배열)
}

// 도감 상태
export interface CollectionStatus {
  placeId: string;
  level: 'locked' | 'discovered' | 'visited';  // 3단계
  firstChatAt?: number;        // 첫 대화 시각
  visitedAt?: number;          // 방문 인증 시각
}