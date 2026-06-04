import Link from 'next/link';
import { Character } from '@/lib/types';

export default function CharacterCard({ character }: { character: Character }) {
  return (
    <Link href={`/chat/${character.placeId}`}>
      <div className="rounded-2xl border p-4 hover:shadow-lg transition">
        <img src={character.thumbnail} alt={character.name} className="w-full h-32 object-cover rounded-xl mb-3" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">{character.emoji}</span>
          <h3 className="font-bold text-lg">{character.name}</h3>
        </div>
        <p className="text-sm text-gray-500">{character.region} · {character.mbti}</p>
        <p className="text-sm mt-2 line-clamp-2">{character.tagline}</p>
      </div>
    </Link>
  );
}