import type { CollectionStatus } from './types';

export interface SharedSnapshot {
  v: 1; // version
  n?: string; // nickname
  t: number; // timestamp
  d: string[]; // discovered placeIds
  vi: string[]; // visited placeIds
}

// UTF-8 안전 base64 인코딩 (한글 닉네임 포함)
function toBase64Url(str: string): string {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): string {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return decodeURIComponent(escape(atob(b64)));
}

export function encodeSnapshot(snapshot: SharedSnapshot): string {
  return toBase64Url(JSON.stringify(snapshot));
}

export function decodeSnapshot(encoded: string): SharedSnapshot | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (parsed?.v !== 1) return null;
    if (!Array.isArray(parsed.d) || !Array.isArray(parsed.vi)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function buildSnapshot(
  statuses: Record<string, CollectionStatus>,
  nickname?: string
): SharedSnapshot {
  const discovered: string[] = [];
  const visited: string[] = [];
  for (const [placeId, status] of Object.entries(statuses)) {
    if (status.level === 'visited') visited.push(placeId);
    else if (status.level === 'discovered') discovered.push(placeId);
  }
  return {
    v: 1,
    n: nickname?.trim() || undefined,
    t: Date.now(),
    d: discovered,
    vi: visited,
  };
}

// 받은 snapshot을 도감 UI가 쓸 수 있는 statuses 형식으로 변환
export function snapshotToStatuses(
  snapshot: SharedSnapshot
): Record<string, CollectionStatus> {
  const result: Record<string, CollectionStatus> = {};
  for (const id of snapshot.d) {
    result[id] = { placeId: id, level: 'discovered' };
  }
  for (const id of snapshot.vi) {
    result[id] = { placeId: id, level: 'visited', visitedAt: snapshot.t };
  }
  return result;
}