import type { ChatMessage } from './types';

interface EnnoiaRequestBody {
  hash: string;
  params: { persona_card: string };
  messages: {
    role: 'user' | 'assistant';
    content: { type: 'text'; text: string }[];
  }[];
}

async function callEnnoia(personaCard: string, messages: ChatMessage[]) {
  const url = process.env.ENNOIA_API_URL!;
  const project = process.env.ENNOIA_PROJECT!;
  const apiKey = process.env.ENNOIA_API_KEY!;
  const hash = process.env.ENNOIA_HASH!;

  const body: EnnoiaRequestBody = {
    hash,
    params: { persona_card: personaCard },
    messages: messages.map((m) => ({
      role: m.role,
      content: [{ type: 'text' as const, text: m.content }],
    })),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      project,
      apiKey,
      'X-ENNOIA-USER-ID': 'tour-friends-mvp',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[ennoia] HTTP error:', res.status, errText);
    throw new Error(`Ennoia API error: ${res.status}`);
  }

  const data = await res.json();
  console.log('[ennoia] raw response:', JSON.stringify(data, null, 2));

  const reply =
    data?.choices?.[0]?.message?.content?.[0]?.text ??
    data?.choices?.[0]?.message?.content ??
    data?.message?.content ??
    data?.content ??
    data?.reply ??
    data?.result?.content ??
    data?.data?.content;

  if (!reply || typeof reply !== 'string') {
    throw new Error('Cannot parse Ennoia response');
  }

  return reply;
}

// 스트리밍: 응답 받은 후 청크로 나눠서 흘려보냄
export async function sendToEnnoiaStream(
  personaCard: string,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const reply = await callEnnoia(personaCard, messages);
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      const chunks = reply.match(/[\s\S]{1,6}/g) || [];
      let i = 0;
      function push() {
        if (i >= chunks.length) {
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
          return;
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: chunks[i] })}\n\n`)
        );
        i++;
        setTimeout(push, 30);
      }
      push();
    },
  });
}

// 기존 함수 유지
export async function sendToEnnoia(
  personaCard: string,
  messages: ChatMessage[]
): Promise<string> {
  return callEnnoia(personaCard, messages);
}