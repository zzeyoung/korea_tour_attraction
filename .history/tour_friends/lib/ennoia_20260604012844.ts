export async function sendToEnnoia(
  personaCard: string, 
  messages: ChatMessage[]
): Promise<string> {
  const res = await fetch(`${process.env.ENNOIA_API_URL}/agents/${process.env.ENNOIA_AGENT_ID}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ENNOIA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variables: { persona_card: personaCard },
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  
  const data = await res.json();
  return data.reply;  // 응답 형식은 엔노이아 매뉴얼대로
}