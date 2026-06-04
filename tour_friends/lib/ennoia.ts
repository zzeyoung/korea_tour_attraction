export async function sendToEnnoia(
  personaCard: string,
  messages: { role: string; content: string }[]
) {
  const response = await fetch(
    "https://api.ennoia.so/api/preset/v2/chat/completions",
    {
      method: "POST",
      headers: {
        "project": process.env.ENNOIA_PROJECT!,
        "apiKey": process.env.ENNOIA_API_KEY!,
        "Content-Type": "application/json; charset=utf-8",
        "X-ENNOIA-USER-ID": process.env.ENNOIA_USER_ID!,
      },
      body: JSON.stringify({
        hash: process.env.ENNOIA_HASH!,
        params: { persona_card: personaCard },
        messages: messages.map((m) => ({
          role: m.role,
          content: [{ type: "text", text: m.content }],
        })),
      }),
    }
  );

  const data = await response.json();
  return data;
}