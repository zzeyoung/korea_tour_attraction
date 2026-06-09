# 🏯 관광지가 나에게 말을 건다

> **한국의 관광지가 살아 숨쉬는 AI 캐릭터가 되어, 당신에게 말을 겁니다.**

관광지마다 고유한 성격, 말투, MBTI를 가진 AI 캐릭터와 대화하며 한국 여행을 더 깊이 경험할 수 있는 인터랙티브 관광 플랫폼입니다.

경복궁은 조선시대 격식 있는 말투로, 해운대는 부산 사투리로, 성산일출봉은 제주 방언으로 당신을 맞이합니다.

---

## ✨ 주요 기능

### 💬 AI 캐릭터 채팅
각 관광지가 고유한 인격을 가진 AI 캐릭터로 구현되어 있습니다. 역사적 배경, 지역 방언, MBTI 성격 유형이 반영된 자연스러운 대화를 경험할 수 있습니다.

### 📍 GPS 기반 방문 인증
실제 관광지 반경 500m 이내에서 GPS 인증을 통해 방문을 기록합니다. 방문 후에만 열리는 특별한 콘텐츠가 준비되어 있습니다.

### 📒 방명록
관광지 방문 인증 후 잠금 해제되는 프라이빗 방명록에 사진과 함께 추억을 기록할 수 있습니다.

### 📖 도감 시스템
발견 · 대화 · 방문의 3단계 수집 상태로 관광지 캐릭터를 모아가는 컬렉션 시스템입니다.

### 🔗 공유
대화 내용을 이미지로 캡처하여 SNS에 공유하거나, 읽기 전용 공유 페이지 링크를 생성할 수 있습니다.

---

## 🗺️ 등장 캐릭터

| 캐릭터 | 지역 | MBTI | 말투 특징 |
|--------|------|------|----------|
| 경복궁 | 서울 | ISTJ | 조선시대 격식체 |
| 덕수궁 | 서울 | INFP | 근대사적 감성체 |
| 운현궁 | 서울 | ENTJ | 단호한 역사체 |
| 수원 화성 | 경기 | INTJ | 실학적 논리체 |
| 강화도 | 인천 | ISTP | 담백한 역사체 |
| 전곡선사박물관 | 경기 | INTP | 선사시대 탐구체 |
| 정동심곡 바다부채길 | 강원 | ISFP | 자연 감성체 |
| 묵호등대 | 강원 | ISFJ | 강원도 사투리 |
| 낙산해수욕장 | 강원 | ESFP | MZ세대 캐주얼체 |
| 환선굴 | 강원 | INTP | 지질학적 탐구체 |
| 한반도지형 | 강원 | INFJ | 고요한 자연체 |
| 해운대 | 부산 | ENFP | 부산 사투리 |
| 팔공산 | 대구 | ESTJ | 대구 사투리 |
| 불국사 | 경주 | ISFJ | 불교적 격식체 |
| 황매산 | 경남 | ENFP | 자연 친화체 |
| 청산도 | 전남 | INFP | 느린 섬 감성체 |
| 죽녹원 | 전남 | ISFP | 전라도 사투리 |
| 성산일출봉 | 제주 | ENFJ | 제주 방언 |

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **LLM 플랫폼** | Ennoia (by Wanted) |
| **관광 데이터** | KTO (한국관광공사) MCP Server |
| **위치 인증** | Haversine Formula + Web Geolocation API |
| **이미지 처리** | Canvas API (클라이언트 사이드 압축) |
| **공유** | html2canvas + Web Share API |
| **데이터 저장** | localStorage |

---

## 🏗️ 시스템 아키텍처

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Next.js 14  │────▶│  Ennoia API  │────▶│   Claude LLM    │
│  (Frontend)  │◀────│  (LLM 플랫폼) │◀────│  + MCP Tool Use │
└──────┬───────┘     └──────────────┘     └────────┬────────┘
       │                                           │
       │  GPS 인증 / localStorage                    │  실시간 관광 데이터
       │                                           │
       ▼                                           ▼
┌─────────────┐                          ┌─────────────────┐
│   사용자 기기  │                          │  KTO MCP Server │
│ (위치/저장소)  │                          │ (한국관광공사)     │
└─────────────┘                          └─────────────────┘
```

---

## 📁 프로젝트 구조

```
tour_friends/
├── app/
│   ├── page.tsx                    # 랜딩 페이지
│   ├── places/page.tsx             # 캐릭터 목록 (지역 필터)
│   ├── chat/[placeId]/page.tsx     # AI 채팅 화면
│   ├── collection/page.tsx         # 도감 페이지
│   ├── shared/[snapshot]/page.tsx  # 읽기 전용 공유 페이지
│   └── api/chat/route.ts          # Ennoia API 프록시
├── data/
│   ├── characters.json             # 캐릭터 메타데이터
│   └── personas/                   # 캐릭터별 페르소나 파일
│       ├── gyeongbokgung.txt
│       ├── haeundae.txt
│       └── ...
├── lib/
│   ├── types.ts                    # 타입 정의
│   ├── storage.ts                  # localStorage 관리
│   ├── ennoia.ts                   # Ennoia API 클라이언트
│   ├── persona.ts                  # 페르소나 로딩
│   ├── geo.ts                      # GPS / Haversine
│   ├── region.ts                   # 지역 분류
│   ├── share.ts                    # 공유 기능
│   ├── capture.ts                  # 화면 캡처
│   └── image.ts                    # 이미지 압축
└── components/
    ├── TopNav.tsx
    └── BottomNav.tsx
```

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Ennoia API 키
- KTO MCP Server 토큰

### 설치

```bash
git clone https://github.com/your-username/tour_friends.git
cd tour_friends
npm install
```

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```env
ENNOIA_API_KEY=your_ennoia_api_key
ENNOIA_PROJECT=your_project_id
KTO_MCP_TOKEN=your_kto_mcp_bearer_token
```

### 실행

```bash
npm run dev
```

`http://localhost:3000`에서 앱을 확인할 수 있습니다.

---

## 🎭 캐릭터 설계 원칙

| 유형 | 대표 캐릭터 | 말투 규칙 |
|------|-----------|----------|
| **역사 유적** | 경복궁, 덕수궁, 불국사 | 시대에 맞는 격식체, 이모지 사용 금지 |
| **자연/야외** | 황매산, 죽녹원, 한반도지형 | 차분한 현대 한국어, 가벼운 지역 사투리 |
| **MZ 코드** | 낙산해수욕장 | 캐주얼 반말, 이모지 자유 사용 |
| **사투리** | 묵호등대(강원), 해운대(부산), 성산일출봉(제주) | 방언은 양념 수준, 과도한 사투리 지양 |

---

## 📄 라이선스

This project is licensed under the MIT License.

---

<p align="center">
  <i>관광지가 당신에게 말을 걸 때, 여행은 더 깊어집니다.</i>
</p>
