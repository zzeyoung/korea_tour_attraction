'use client';

interface Props {
  provinces: string[];
  cities: string[];
  selectedProvince: string | null;
  selectedCity: string | null;
  onProvinceChange: (p: string | null) => void;
  onCityChange: (c: string | null) => void;
  counts: {
    province: Record<string, number>;
    city: Record<string, number>;
    all: number;
  };
}

export default function RegionFilter({
  provinces,
  cities,
  selectedProvince,
  selectedCity,
  onProvinceChange,
  onCityChange,
  counts,
}: Props) {
  return (
    <div className="space-y-4">
      {/* 시/도 */}
      <div>
        <div className="text-[11px] font-bold text-stone-500 tracking-wider mb-2.5 uppercase">
          지역
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onProvinceChange(null);
              onCityChange(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
              !selectedProvince
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            전체 <span className="opacity-60 ml-0.5">{counts.all}</span>
          </button>
          {provinces.map((p) => (
            <button
              key={p}
              onClick={() => {
                onProvinceChange(p);
                onCityChange(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                selectedProvince === p
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              {p} <span className="opacity-60 ml-0.5">{counts.province[p] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 시/군/구 — 시/도 선택 시만 노출 */}
      {selectedProvince && cities.length > 0 && (
        <div className="pl-3 border-l-2 border-rose-200">
          <div className="text-[11px] font-bold text-stone-500 tracking-wider mb-2.5 uppercase">
            세부 지역
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onCityChange(null)}
              className={`px-3 py-1 rounded-full text-xs transition-all active:scale-95 ${
                !selectedCity
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-200'
              }`}
            >
              모두
            </button>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => onCityChange(c)}
                className={`px-3 py-1 rounded-full text-xs transition-all active:scale-95 ${
                  selectedCity === c
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-200'
                }`}
              >
                {c} <span className="opacity-60 ml-0.5">{counts.city[c] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}