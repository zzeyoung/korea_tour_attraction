'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { ChatMessage } from '@/lib/types';
import {
  getChatHistory,
  saveChatHistory,
  markAsDiscovered,
} from '@/lib/storage';

export default function ChatPage() {
  const params = useParams();
  const placeId = params.placeId as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 마운트 시 localStorage에서 히스토리 로드
  useEffect(() => {
    const history = getChatHistory(placeId);
    setMessages(history);
    setHydrated(true);
  }, [placeId]);

  // 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

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

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // 💾 localStorage 저장
      saveChatHistory(placeId, finalMessages);

      // 🏆 첫 대화면 도감에 '발견됨'으로 등록
      markAsDiscovered(placeId);
    } catch (err) {
      console.error(err);
      alert('대화 실패: ' + (err instanceof Error ? err.message : err));
      // 실패 시 유저 메시지는 롤백하지 않음 (UX 판단). 저장도 안 함.
    } finally {
      setLoading(false);
    }
  }

  // hydration 깜빡임 방지
  if (!hydrated) {
    return <div className="p-4">불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">채팅 (placeId: {placeId})</h1>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 mb-4 p-3 bg-gray-50 rounded"
      >
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-8">
            메시지를 보내 대화를 시작해보세요
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">생각하는 중...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          placeholder="메시지 입력..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}