'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { encodeSnapshot, buildSnapshot } from '@/lib/share';
import { captureElement, downloadDataUrl, shareImage } from '@/lib/capture';
import type { Character, CollectionStatus } from '@/lib/types';
import ShareCard from './ShareCard';

interface Props {
  open: boolean;
  onClose: () => void;
  characters: Character[];
  statuses: Record<string, CollectionStatus>;
}

export default function ShareModal({
  open,
  onClose,
  characters,
  statuses,
}: Props) {
  const [tab, setTab] = useState<'image' | 'url'>('image');
  const [nickname, setNickname] = useState('');
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const snapshot = buildSnapshot(statuses, nickname);
    return `${window.location.origin}/shared/${encodeSnapshot(snapshot)}`;
  }, [statuses, nickname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSaveImage() {
    if (!captureRef.current) return;
    setCapturing(true);
    try {
      const dataUrl = await captureElement(captureRef.current);
      const filename = `tour-friends-${Date.now()}.png`;
      const text = nickname.trim()
        ? `${nickname}의 발자국 · 관광지 친구들`
        : '나의 발자국 · 관광지 친구들';
      const shared = await shareImage(dataUrl, filename, text);
      if (!shared) downloadDataUrl(dataUrl, filename);
    } catch (e) {
      console.error(e);
      alert('이미지 만들기 실패');
    } finally {
      setCapturing(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
          <div className="text-2xl">📤</div>
          <div className="flex-1">
            <div className="font-bold text-stone-900">도감 공유하기</div>
            <div className="text-[11px] text-stone-500">
              방명록은 공유되지 않아요
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* 닉네임 */}
          <div className="px-5 pt-4">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 20))}
              placeholder="닉네임 (선택)"
              className="w-full px-4 py-2.5 bg-stone-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-stone-300"
            />
          </div>

          {/* 탭 */}
          <div className="px-5 pt-3 flex gap-1">
            <button
              onClick={() => setTab('image')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                tab === 'image'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              🖼️ 이미지
            </button>
            <button
              onClick={() => setTab('url')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                tab === 'url'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              🔗 링크
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {tab === 'image' ? (
              <div>
                <div className="text-[11px] text-stone-500 mb-3 text-center">
                  미리보기
                </div>
                <div className="flex justify-center mb-4">
                  <ShareCard
                    ref={captureRef}
                    characters={characters}
                    statuses={statuses}
                    nickname={nickname.trim() || undefined}
                  />
                </div>
                <button
                  onClick={handleSaveImage}
                  disabled={capturing}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-all"
                >
                  {capturing ? '만드는 중...' : '이미지로 저장'}
                </button>
                <div className="text-[10px] text-stone-400 mt-2 text-center">
                  모바일은 공유 시트, 데스크탑은 자동 다운로드
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs text-stone-600 leading-relaxed mb-3">
                  링크를 받은 사람은 너의 도감을 인터랙티브하게 볼 수 있어요.
                  카드를 누르면 그 친구와 직접 대화도 가능해요.
                </div>
                <div className="bg-stone-100 rounded-xl p-3 text-xs text-stone-700 break-all max-h-32 overflow-y-auto mb-3 font-mono">
                  {shareUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className={`w-full py-2.5 rounded-full text-sm font-medium transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {copied ? '✓ 복사 완료' : '링크 복사하기'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}