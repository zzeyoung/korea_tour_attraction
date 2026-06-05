'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: '홈' },
  { href: '/places', label: '캐릭터' },
  { href: '/collection', label: '도감' },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden md:block sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🏯</span>
            <span className="font-bold text-stone-900 tracking-tight">
              관광지 친구들
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {items.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}