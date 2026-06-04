'use client';

import { useState, useEffect, useRef } from 'react';
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

const characters = charactersData as CharactersData;

// AI 답변에서 친구 이름 언급 감지
function detectMentionedFriends(text: string, currentPlaceId: string): string[] {
  const character = characters[currentPlaceId];
  if (!character) return [];

  const mentioned = new Set<string>();
  for (const f of character.friends) {
    const friendChar = characters[f.placeId];
    if (!friendChar) continue; // characters.json에 없는 친구는 스킵
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

  useEffect(() => {
    setMessages(getChatHistory(placeId));
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');

      const recommendedFriends = detectMentionedFriends(data.reply, placeId);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        recommendedFriends: recommendedFriends.length
          ? recommendedFriends
          : undefined,
      };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(placeId, finalMessages);
      markAsDiscovered(placeId);
    } catch (err) {
      console.error(err);
      alert('대화 실패: ' + (err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  }

  // 캐릭터 데이터 없음
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
          href="/"
          className="text-stone-500 hover:text-stone-900 hover:bg-stone-100 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          aria-label="뒤로"
        >
          ←
        </Link>
        <div className="text-3xl">{character.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-stone-900 leading-tight">
            {character.name}
          </div>
          <div className="text-[11px] text-stone-500 truncate">
            {character.region} · {character.mbti} · {character.age}
          </div>
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
                  className={`max-w-[80%] px-4 py-2.5 whitespace-pre-wrap leading-relaxed text-[15px] ${
                    m.role === 'user'
                      ? 'bg-stone-900 text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-2xl rounded-bl-md shadow-sm'
                  }`}
                >
                  {m.content}
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
    </div>
  );
}