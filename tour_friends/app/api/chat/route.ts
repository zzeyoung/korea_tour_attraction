import { NextRequest, NextResponse } from 'next/server';
import { sendToEnnoia } from '@/lib/ennoia';
import { getPersonaCard } from '@/lib/persona';
import charactersData from '@/data/characters.json';
import type { CharactersData, ChatMessage } from '@/lib/types';

const characters = charactersData as CharactersData;

export async function POST(req: NextRequest) {
  try {
    const { placeId, messages } = (await req.json()) as {
      placeId: string;
      messages: ChatMessage[];
    };

    if (!placeId || !messages) {
      return NextResponse.json(
        { error: 'placeId, messages 필수' },
        { status: 400 }
      );
    }

    const character = characters[placeId];
    if (!character) {
      return NextResponse.json(
        { error: `Character not found: ${placeId}` },
        { status: 404 }
      );
    }

    const personaCard = getPersonaCard(placeId);
    const reply = await sendToEnnoia(personaCard, messages);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[api/chat] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}