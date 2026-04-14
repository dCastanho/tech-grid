export interface CharacterGroup {
  label: string    // Chinese group name
  labelEn: string  // English gloss
  characters: string[]
}

export const CHARACTER_GROUPS: CharacterGroup[] = [
  {
    label: '技法',
    labelEn: 'Techniques',
    characters: ['技', '法', '術', '功', '道', '氣'],
  },
  {
    label: '武器',
    labelEn: 'Weapons',
    characters: ['刀', '劍', '弓', '槍', '斧', '盾'],
  },
  {
    label: '動作',
    labelEn: 'Actions',
    characters: ['攻', '守', '斬', '拳', '掌', '衝'],
  },
  {
    label: '五行',
    labelEn: 'Elements',
    characters: ['火', '水', '木', '金', '土', '雷'],
  },
  {
    label: '神獸',
    labelEn: 'Mythical Beasts',
    characters: ['龍', '虎', '鳳', '麒', '玄', '蛟'],
  },
  {
    label: '策略',
    labelEn: 'Strategy',
    characters: ['陣', '計', '謀', '勢', '奇', '伏'],
  },
]

/** Flat list of every available character, in group order. */
export const ALL_CHARACTERS: string[] = CHARACTER_GROUPS.flatMap(g => g.characters)
