'use client';

import { useState, useEffect, useRef } from 'react';
import GuestbookModal from '@/components/GuestbookModal';
import { getCollectionStatus } from '@/lib/storage';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { ChatMessage, CharactersData } from '@/lib/types';
import {
  getChatHistory,
  saveChatHistory,
  markAsDiscovered,
} from '@/lib/storage';
import charactersData from '@/data/characters.json';
import FriendRecommendCard from '@/components/FriendRecommendCard';
import VisitButton from '@/components/VisitButton';

const characters = charactersData as CharactersData;

// 마크다운 이미지 + 일반 URL 둘 다 처리
function renderContent(content: string) {
  const plainUrlRegex = /(?:^|\s|-)[ \t]*(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp))/gm;
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;

  // 일반 URL을 마크다운 이미지 형식으로 통일
  let normalized = content.replace(
    plainUrlRegex,
    (_, url) => `\n![이미지](${url.trim()})`
  );

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  markdownImageRegex.lastIndex = 0;
  while ((match = markdownImageRegex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
     parts.push(
  <span key={lastIndex}>
    {normalized.slice(lastIndex, match.index).split('\n').map((line, j, arr) => (
      <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
    ))}
  </span>
);
    }
    parts.push(
      <img
        key={match.index}
        src={match[2]}
        alt={match[1]}
        className="w-full rounded-xl mt-2 mb-1"
      />
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    parts.push(
  <span key={lastIndex}>
    {normalized.slice(lastIndex).split('\n').map((line, j, arr) => (
      <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
    ))}
  </span>
);
  }

  return parts.length > 0 ? parts : content;
}

// AI 답변에서 친구 이름 언급 감지
function detectMentionedFriends(text: string, currentPlaceId: string): string[] {
  const character = characters[currentPlaceId];
  if (!character) return [];

  const mentioned = new Set<string>();
  for (const f of character.friends) {
    const friendChar = characters[f.placeId];
    if (!friendChar) continue;
    const names = [friendChar.name, friendChar.shortName].filter(
      Boolean
    ) as string[];
    if (names.some((name) => text.includes(name))) {
      mentioned.add(f.placeId);
    }
  }
  return Array.from(mentioned);
}

export default function ChatPage() {
  const params = useParams();
  const placeId = params.placeId as string;
  const character = characters[placeId];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [guestbookOpen, setGuestbookOpen] = useState(false);
  const [guestbookMode, setGuestbookMode] = useState<'list' | 'write'>('list');
  const [isVisited, setIsVisited] = useState(false);

  useEffect(() => {
    setMessages(getChatHistory(placeId));
    const status = getCollectionStatus(placeId);
    setIsVisited(status.level === 'visited');
    setHydrated(true);
  }, [placeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeId, messages: newMessages }),
  });

  if (!res.ok) throw new Error('API error');

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  // 스트리밍 메시지 먼저 추가 (빈 내용으로)
  const streamingMessage: ChatMessage = {
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
  };
  setMessages([...newMessages, streamingMessage]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

    for (const line of lines) {
      const raw = line.slice(6);
      if (raw === '[DONE]') break;
      try {
        const { text } = JSON.parse(raw);
        fullText += text;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullText,
          };
          return updated;
        });
      } catch {}
    }
  }

  const recommendedFriends = detectMentionedFriends(fullText, placeId);
  const finalMessage: ChatMessage = {
    role: 'assistant',
    content: fullText,
    timestamp: Date.now(),
    recommendedFriends: recommendedFriends.length ? recommendedFriends : undefined,
  };
  const finalMessages = [...newMessages, finalMessage];
  setMessages(finalMessages);
  saveChatHistory(placeId, finalMessages);
  markAsDiscovered(placeId);
}catch (err) {
      console.error(err);
      alert('대화 실패: ' + (err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-stone-500 mb-3">캐릭터를 찾을 수 없어요</div>
          <Link href="/" className="text-rose-700 underline underline-offset-4">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <Link
          href="/places"
          className="text-stone-500 hover:text-stone-900 hover:bg-stone-100 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          aria-label="뒤로"
        >
          ←
        </Link>
        <div className="text-3xl">{character.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-stone-900 leading-tight truncate">
            {character.name}
          </div>
          <div className="text-[11px] text-stone-500 truncate">
            {character.region} · {character.mbti} · {character.age}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setGuestbookMode('list');
              setGuestbookOpen(true);
            }}
            disabled={!isVisited}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-stone-100 text-stone-700"
            title={isVisited ? '방명록 보기' : '방문 인증 후 방명록을 쓸 수 있어요'}
          >
            <span>📓</span>
            <span className="hidden sm:inline">방명록</span>
          </button>

          <VisitButton
            character={character}
            onVisited={() => {
              setIsVisited(true);
              setGuestbookMode('write');
              setGuestbookOpen(true);
            }}
          />
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* 빈 상태 */}
          {hydrated && messages.length === 0 && (
            <div className="text-center mt-12 px-6">
              <div className="text-7xl mb-4">{character.emoji}</div>
              <div className="text-lg font-bold text-stone-900 mb-2">
                {character.name}
              </div>
              <div className="text-sm text-stone-600 leading-relaxed mb-6">
                {character.tagline}
              </div>
              <div className="text-xs text-stone-400">
                메시지를 보내 대화를 시작해보세요
              </div>
            </div>
          )}

          {/* 메시지 + 친구 추천 카드 */}
          {messages.map((m, i) => (
            <div key={i} className="space-y-2">
              <div
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 leading-relaxed text-[15px] ${
                    m.role === 'user'
                      ? 'bg-stone-900 text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-2xl rounded-bl-md shadow-sm'
                  }`}
                >
                  {renderContent(m.content)}
                </div>
              </div>

              {/* 친구 추천 카드 */}
              {m.role === 'assistant' &&
                m.recommendedFriends?.map((friendId) => {
                  const friendChar = characters[friendId];
                  if (!friendChar) return null;
                  const relation =
                    character.friends.find((f) => f.placeId === friendId)
                      ?.relation || '친구';
                  return (
                    <div key={friendId} className="flex justify-start">
                      <div className="max-w-[80%]">
                        <FriendRecommendCard
                          friend={friendChar}
                          relation={relation}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}

          {/* 로딩 */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-md border-t border-stone-200/80 px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSend()
            }
            disabled={loading}
            placeholder={`${
              character.shortName || character.name
            }에게 메시지...`}
            className="flex-1 px-4 py-2.5 bg-stone-100 rounded-full text-[15px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-stone-300 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
          >
            전송
          </button>
        </div>
      </div>

      {/* 방명록 모달 */}
      <GuestbookModal
        character={character}
        open={guestbookOpen}
        initialMode={guestbookMode}
        onClose={() => setGuestbookOpen(false)}
      />
    </div>
  );
}