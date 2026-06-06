import Link from 'next/link';
import charactersData from '@/data/characters.json';
import type { CharactersData } from '@/lib/types';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';

const characters = charactersData as CharactersData;

export default function LandingPage() {
  const featured = Object.values(characters).slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <TopNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-xs font-medium text-rose-700 mb-6">
                <span>✨</span>
                <span>한국관광공사 데이터 기반</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
                한국의 장소가
                <br />
                <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                  말을 건다
                </span>
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed mb-8 max-w-xl">
                경복궁, 묵호등대, 운현궁⋯ 한국의 관광지가 AI 캐릭터가 되어
                당신을 기다립니다. 대화하고, 방문하고, 도감을 채워보세요.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/places"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 active:scale-95 transition-all shadow-lg"
                >
                  <span>캐릭터 만나러 가기</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/collection"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-900 rounded-full font-medium hover:border-stone-300 hover:shadow-sm active:scale-95 transition-all"
                >
                  <span>📖</span>
                  <span>도감 보기</span>
                </Link>
              </div>
            </div>

            {/* Right: floating emoji collage (desktop only) */}
            <div className="relative h-[500px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-stone-100 rounded-[3rem] rotate-3" />
              <div className="absolute top-8 left-12 bg-white p-4 rounded-2xl shadow-xl rotate-[-8deg] hover:rotate-0 transition-transform">
                <div className="text-5xl mb-2">🏯</div>
                <div className="text-sm font-bold">경복궁</div>
                <div className="text-xs text-stone-500">"허허, 오셨는가"</div>
              </div>
              <div className="absolute top-20 right-8 bg-white p-4 rounded-2xl shadow-xl rotate-[6deg] hover:rotate-0 transition-transform">
                <div className="text-5xl mb-2">🏮</div>
                <div className="text-sm font-bold">묵호등대</div>
                <div className="text-xs text-stone-500">"어디서 왔노?"</div>
              </div>
              <div className="absolute bottom-12 left-20 bg-white p-4 rounded-2xl shadow-xl rotate-[4deg] hover:rotate-0 transition-transform">
                <div className="text-5xl mb-2">🏄</div>
                <div className="text-sm font-bold">양양</div>
                <div className="text-xs text-stone-500">"파도 타러 갈래?"</div>
              </div>
              <div className="absolute bottom-20 right-16 bg-white p-4 rounded-2xl shadow-xl rotate-[-5deg] hover:rotate-0 transition-transform">
                <div className="text-5xl mb-2">🏠</div>
                <div className="text-sm font-bold">운현궁</div>
                <div className="text-xs text-stone-500">"조용히⋯"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-3">
              새로운 방식의 여행
            </h2>
            <p className="text-stone-600">
              읽지 말고, 대화하세요. 사진만 찍지 말고, 친구를 만드세요.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
                💬
              </div>
              <h3 className="font-bold text-stone-900 mb-2">진짜 캐릭터와 대화</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                경복궁은 사극 양반 말투로, 묵호등대는 강원도 사투리로. 각
                장소의 성격을 살린 진짜 대화.
              </p>
            </div>
            <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
                📍
              </div>
              <h3 className="font-bold text-stone-900 mb-2">GPS 방문 인증</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                실제로 그 장소에 가야 도감의 컬러가 풀려요. 여행이 게임이
                됩니다.
              </p>
            </div>
            <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
                📖
              </div>
              <h3 className="font-bold text-stone-900 mb-2">3단계 도감 시스템</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                미발견 → 발견 → 방문. 모을수록 한국 지도가 채워집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured characters */}
      <section className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-2">
                인기 캐릭터
              </h2>
              <p className="text-stone-600 text-sm">
                지금 가장 많이 대화하는 친구들
              </p>
            </div>
            <Link
              href="/places"
              className="text-sm text-stone-700 hover:text-stone-900 font-medium hidden md:block"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featured.map((c) => (
              <Link
                key={c.placeId}
                href={`/chat/${c.placeId}`}
                className="group bg-white border border-stone-200 rounded-2xl p-4 md:p-5 hover:shadow-md hover:border-stone-300 active:scale-[0.98] transition-all"
              >
                <div className="text-4xl md:text-5xl mb-3">{c.emoji}</div>
                <div className="font-bold text-stone-900 text-sm md:text-base mb-0.5">
                  {c.name}
                </div>
                <div className="text-[11px] text-stone-500 mb-2">
                  {c.region} · {c.mbti}
                </div>
                <div className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {c.tagline}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link
              href="/places"
              className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-900 font-medium text-sm"
            >
              전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <div className="font-bold text-white mb-1">관광지 친구들</div>
              <div className="text-xs">한국관광공사 데이터 기반 · 2026</div>
            </div>
            <div className="text-xs">KNTO-PROMPTON-2026-065</div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}