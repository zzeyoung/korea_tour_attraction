import fs from 'fs';
import path from 'path';

export function getPersonaCard(placeId: string): string {
  const filePath = path.join(process.cwd(), 'data', 'personas', `${placeId}.txt`);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`[persona] ${placeId}.txt 못 찾음:`, e);
    throw new Error(`Persona not found: ${placeId}`);
  }
}