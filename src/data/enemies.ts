import type { EnemyDef } from '@/types'

export const enemies: Record<string, EnemyDef> = {
  ramenSlime: {
    id: 'ramenSlime',
    name: 'ラーメンスライム',
    hp: 18,
    atk: 5,
    def: 1,
    xp: 12,
    gold: 80,
    drops: [{ itemId: 'instant_ramen', rate: 0.35 }],
    healthDamage: { blood: 2, uric: 0.1, chol: 4, liver: 1, sugar: 2 },
    category: 'yokocho',
    sprite: { atlas: 'enemies', x: 0, y: 0, w: 32, h: 32 },
  },
  yakitoriBoss: {
    id: 'yakitoriBoss',
    name: '焼き鳥大将',
    hp: 90,
    atk: 12,
    def: 5,
    xp: 80,
    gold: 450,
    drops: [{ itemId: 'legendary_skewer', rate: 1 }],
    healthDamage: { blood: 8, uric: 0.4, chol: 12, liver: 5, sugar: 6 },
    category: 'boss',
    sprite: { atlas: 'bosses', x: 0, y: 0, w: 64, h: 64 },
    skills: ['charcoalBurst'],
    boss: true,
  },
}

export function getEnemyDef(enemyId: string): EnemyDef {
  const enemy = enemies[enemyId]
  if (!enemy) {
    throw new Error(`Unknown enemy: ${enemyId}`)
  }
  return enemy
}
