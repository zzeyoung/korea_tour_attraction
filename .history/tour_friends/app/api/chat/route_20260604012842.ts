// app/api/chat/route.ts
import characters from '@/data/characters.json';
import { getPersonaCard } from '@/lib/persona';

export async function POST(req: Request) {
  const { placeId, messages } = await req.json();
  const character = characters[placeId];
  const personaCard = getPersonaCard(placeId);  // .txt 파일에서 읽기

  
  
  // 엔노이아 호출 시 personaCard 전달
  // ...
}