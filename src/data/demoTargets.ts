import type { TargetImage } from '../domain/experiment';

const card = (emoji: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-size='72'>${emoji}</text></svg>`)}`;

export const demoTargets: TargetImage[] = [
  { id: 't1', title: 'Forest', imageUrl: card('🌲', '#264653'), category: 'Natur' },
  { id: 't2', title: 'Ocean', imageUrl: card('🌊', '#1d3557'), category: 'Wasser' },
  { id: 't3', title: 'Mountain', imageUrl: card('⛰️', '#457b9d'), category: 'Natur' },
  { id: 't4', title: 'Bridge', imageUrl: card('🌉', '#2a9d8f'), category: 'Gebäude' },
  { id: 't5', title: 'Robot', imageUrl: card('🤖', '#6d6875'), category: 'Technik' },
  { id: 't6', title: 'Cat', imageUrl: card('🐈', '#b56576'), category: 'Tier' },
  { id: 't7', title: 'Bird', imageUrl: card('🦉', '#8d99ae'), category: 'Tier' },
  { id: 't8', title: 'Boat', imageUrl: card('⛵', '#0077b6'), category: 'Objekt' },
  { id: 't9', title: 'Fire', imageUrl: card('🔥', '#e76f51'), category: 'Feuer' },
  { id: 't10', title: 'Person', imageUrl: card('🧍', '#588157'), category: 'Mensch' },
  { id: 't11', title: 'Camera', imageUrl: card('📷', '#3a5a40'), category: 'Objekt' },
  { id: 't12', title: 'City', imageUrl: card('🏙️', '#4a4e69'), category: 'Gebäude' }
];
