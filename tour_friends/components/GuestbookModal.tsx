'use client';

import { useState, useEffect, useRef } from 'react';
import type { Character, GuestbookEntry } from '@/lib/types';
import {
  getGuestbookEntries,
  addGuestbookEntry,
  deleteGuestbookEntry,
} from '@/lib/storage';
import { compressImage } from '@/lib/image';

interface Props {
  character: Character;
  open: boolean;
  initialMode?: 'list' | 'write';
  onClose: () => void;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function GuestbookModal({
  character,
  open,
  initialMode = 'list',
  onClose,
}: Props) {
  const [mode, setMode] = useState<'list' | 'write'>(initialMode);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [content, setContent] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setEntries(getGuestbookEntries(character.placeId));
      setMode(initialMode);
      setContent('');
      setPhotoBase64(undefined);
    }
  }, [open, character.placeId, initialMode]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPhotoBase64(compressed);
    } catch (err) {
      console.error(err);
      alert('사진을 불러올 수 없어요.');
    }
  }

  async function handleSave() {
    if (!content.trim()) {
      alert('내용을 적어주세요');
      return;
    }
    setSaving(true);
    try {
      addGuestbookEntry(character.placeId, {
        content: content.trim(),
        photoBase64,
      });
      setEntries(getGuestbookEntries(character.placeId));
      setContent('');
      setPhotoBase64(undefined);
      setMode('list');
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: string) {
    if (!confirm('이 글을 삭제할까요?')) return;
    deleteGuestbookEntry(character.placeId, id);
    setEntries(getGuestbookEntries(character.placeId));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
          <div className="text-2xl">{character.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-stone-500 tracking-wide">
              나의 방명록 · 비공개
            </div>
            <div className="font-bold text-stone-900 truncate">
              {character.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-xl"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* LIST MODE */}
          {mode === 'list' && (
            <div className="p-5 space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3 grayscale opacity-50">📝</div>
                  <div className="text-stone-700 text-sm font-medium mb-1">
                    아직 방명록이 없어요
                  </div>
                  <div className="text-xs text-stone-400 mb-6">
                    첫 추억을 남겨보세요
                  </div>
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-stone-50 border border-stone-200 rounded-2xl p-4"
                  >
                    {entry.photoBase64 && (
                      <img
                        src={entry.photoBase64}
                        alt=""
                        className="w-full rounded-lg mb-3 max-h-72 object-cover"
                      />
                    )}
                    <p className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200/60">
                      <span className="text-[11px] text-stone-400">
                        {formatDate(entry.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WRITE MODE */}
          {mode === 'write' && (
            <div className="p-5 space-y-3">
              <div className="text-xs text-stone-500 leading-relaxed bg-amber-50 border border-amber-200 rounded-lg p-3">
                💡 이 글은 나만 볼 수 있어요. 솔직하게 적어도 괜찮아요.
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`${character.shortName ?? character.name}에서 무엇을 느꼈나요?\n날씨, 함께한 사람, 인상 깊었던 순간...`}
                rows={6}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl resize-none text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-stone-300 transition-all leading-relaxed"
              />

              {/* Photo */}
              {photoBase64 ? (
                <div className="relative">
                  <img
                    src={photoBase64}
                    alt=""
                    className="w-full rounded-xl max-h-60 object-cover"
                  />
                  <button
                    onClick={() => setPhotoBase64(undefined)}
                    className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full text-sm flex items-center justify-center backdrop-blur-sm hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-xs text-stone-500 hover:border-stone-300 hover:bg-stone-50 transition-colors"
                >
                  📷 사진 추가 (선택)
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-100 flex items-center gap-2 bg-white">
          {mode === 'list' ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm text-stone-600 font-medium hover:text-stone-900 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => setMode('write')}
                className="flex-1 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 active:scale-95 transition-all"
              >
                + 새 글
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  entries.length > 0 ? setMode('list') : onClose()
                }
                className="flex-1 py-2.5 text-sm text-stone-600 font-medium hover:text-stone-900 transition-colors"
              >
                {entries.length > 0 ? '취소' : '나중에'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="flex-1 py-2.5 bg-rose-600 text-white text-sm font-medium rounded-full hover:bg-rose-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}