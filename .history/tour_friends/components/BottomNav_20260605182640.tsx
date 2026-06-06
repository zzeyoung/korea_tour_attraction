'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const items: NavItem[] = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/places', label: '캐릭터', icon: '✨' },
  { href: '/collection', label: '도감', icon: '📖' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-stone-200/80 z-20">
      <div className="max-w-2xl mx-auto flex">
        {items.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 active:scale-95 transition-transform"
            >
              <span
                className={`text-xl transition-all ${
                  isActive ? 'scale-110' : 'grayscale opacity-50'
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  isActive ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}