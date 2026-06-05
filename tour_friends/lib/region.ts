import type { Character } from './types';

export interface ParsedRegion {
  province: string; // 시/도 (서울, 강원 등)
  city: string;     // 시/군/구 (종로구, 양양군 등)
}

// "서울 종로구" → { province: "서울", city: "종로구" }
export function parseRegion(region: string): ParsedRegion {
  const trimmed = region.trim();
  const spaceIdx = trimmed.indexOf(' ');
  if (spaceIdx === -1) return { province: trimmed, city: '' };
  return {
    province: trimmed.slice(0, spaceIdx),
    city: trimmed.slice(spaceIdx + 1).trim(),
  };
}

// 모든 캐릭터에서 unique 시/도 목록 (캐릭터 수 많은 순)
export function getAllProvinces(characters: Character[]): string[] {
  const counts: Record<string, number> = {};
  for (const c of characters) {
    const p = parseRegion(c.region).province;
    counts[p] = (counts[p] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => name);
}

// 특정 시/도 안의 시/군/구 목록
export function getCitiesByProvince(
  characters: Character[],
  province: string
): string[] {
  const set = new Set<string>();
  for (const c of characters) {
    const parsed = parseRegion(c.region);
    if (parsed.province === province && parsed.city) {
      set.add(parsed.city);
    }
  }
  return Array.from(set).sort();
}

// 필터 적용
export function filterByRegion(
  characters: Character[],
  province: string | null,
  city: string | null
): Character[] {
  return characters.filter((c) => {
    const parsed = parseRegion(c.region);
    if (province && parsed.province !== province) return false;
    if (city && parsed.city !== city) return false;
    return true;
  });
}