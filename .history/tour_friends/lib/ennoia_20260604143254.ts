import type { ChatMessage } from './types';

interface EnnoiaRequestBody {
  hash: string;
  params: {
    persona_card: string;
  };
  messages: {
    role: 'user' | 'assistant';
    content: { type: 'text'; text: string }[];
  }[];
}

export async function sendToEnnoia(
  personaCard: string,
  messages: ChatMessage[]
): Promise<string> {
  const url = process.env.ENNOIA_API_URL!;
  const project = process.env.ENNOIA_PROJECT!;
  const apiKey = process.env.ENNOIA_API_KEY!;
  const hash = process.env.ENNOIA_HASH!;

  // 우리 ChatMessage[] → 엔노이아 형식 변환
  const ennoiaMessages = messages.map((m) => ({
    role: m.role,
    content: [{ type: 'text' as const, text: m.content }],
  }));

  const body: EnnoiaRequestBody = {
    hash,
    params: { persona_card: personaCard },
    messages: ennoiaMessages,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      project,
      apiKey,
      'X-ENNOIA-USER-ID': 'tour-friends-mvp',  // ⭐ 추가
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
  
  // ⚠️ 응답 형식이 정확히 어떤지 모름. 일단 로그 찍어서 확인.
  console.log('[ennoia] raw response:', JSON.stringify(data, null, 2));

  // 가장 흔한 OpenAI 호환 형식부터 시도, 폴백 여러 개.
  const reply =
    data?.choices?.[0]?.message?.content?.[0]?.text ??  // OpenAI-ish + content array
    data?.choices?.[0]?.message?.content ??             // OpenAI 호환
    data?.message?.content ??                            // 단순 형식
    data?.content ??                                     // 더 단순
    data?.reply ??                                       // 일부 LLM 게이트웨이
    data?.result?.content ??                             // 또 다른 가능성
    data?.data?.content;                                 // 일부 한국 LLM

  if (!reply || typeof reply !== 'string') {
    console.error('[ennoia] 응답에서 텍스트 못 찾음. 위의 raw response 확인 필요.');
    throw new Error('Cannot parse Ennoia response');
  }

  return reply;
}