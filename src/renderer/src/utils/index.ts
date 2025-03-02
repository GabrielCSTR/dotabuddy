export function normalizeHeroName(heroName: string): string {
  return String(heroName).split('npc_dota_hero_')[1].split('_').join(' ').toLocaleUpperCase()
}

export function normalizeHeroNameImage(heroName: string): string {
  return String(heroName).split('npc_dota_hero_')[1]
}

export function normalizeItemName(heroName: string): string {
  return String(heroName).split('item_')[1].split('_').join(' ').toLocaleUpperCase()
}

export function normalizeItemNameImage(heroName: string): string {
  return String(heroName).split('item_')[1]
}
