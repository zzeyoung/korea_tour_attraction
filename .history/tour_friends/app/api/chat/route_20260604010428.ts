import fs from 'fs';
import path from 'path';

export function getPersonaCard(placeId: string): string {
  const filePath = path.join(process.cwd(), 'data', 'personas', `${placeId}.txt`);
  return fs.readFileSync(filePath, 'utf-8');
}