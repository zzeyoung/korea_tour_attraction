// 가장 간단한 방식: 캐릭터의 friends 배열을 보고, 
// 답변 텍스트에 친구 이름이 포함되어 있으면 자동 노출
import characters from '@/data/characters.json';

export function detectRecommendedFriends(
  assistantMessage: string, 
  currentCharacter: Character
): string[] {
  const recommended: string[] = [];
  for (const friend of currentCharacter.friends) {
    const friendChar = characters[friend.placeId];
    if (friendChar && assistantMessage.includes(friendChar.shortName)) {
      recommended.push(friend.placeId);
    }
  }
  return recommended;
}