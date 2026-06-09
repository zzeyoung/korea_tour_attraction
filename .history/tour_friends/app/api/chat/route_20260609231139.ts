import { NextRequest } from 'next/server';
import { sendToEnnoiaStream } from '@/lib/ennoia';
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
      return new Response(JSON.stringify({ error: 'placeId, messages 필수' }), { status: 400 });
    }

    if (!characters[placeId]) {
      return new Response(JSON.stringify({ error: `Character not found: ${placeId}` }), { status: 404 });
    }

    const personaCard = getPersonaCard(placeId);
    const trimmedMessages = messages.slice(-10);
    const stream = await sendToEnnoiaStream(personaCard, trimmedMessages);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[api/chat] error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500 }
    );
  }
}