import characters from '@/data/characters.json';
import CharacterCard from '@/components/CharacterCard';

export default function HomePage() {
  const characterList = Object.values(characters);
  
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">관광지가 말을 건다</h1>
      <p className="text-gray-600 mb-6">한국 곳곳의 관광지가 당신과 친구가 되고 싶어해요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characterList.map(char => (
          <CharacterCard key={char.placeId} character={char} />
        ))}
      </div>
      
      <Link href="/collection" className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg">
        📖 도감
      </Link>
    </main>
  );
}