import { sendToEnnoia } from '@/lib/ennoia';

export async function POST(req: Request) {
  console.log('HASH:', process.env.ENNOIA_HASH);
  console.log('PROJECT:', process.env.ENNOIA_PROJECT);
  
  const { messages } = await req.json();
  const result = await sendToEnnoia("테스트 카드입니다.", messages);
  return Response.json(result);
}