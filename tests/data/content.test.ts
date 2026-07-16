import { describe, expect, it } from 'vitest'
import { enemies } from '../../src/data/enemies'
import { items } from '../../src/data/items'
import { foods } from '../../src/data/foods'
import { fish } from '../../src/data/fish'
import { npcs } from '../../src/data/npcs'
import { skills } from '../../src/data/skills'
import { quests } from '../../src/data/quests'
import { events } from '../../src/data/events'
import { endings } from '../../src/data/endings'
import type { EnemyCategory, HealthStats } from '../../src/types'

const hasUniqueIds = (entries: { id: string }[]) => new Set(entries.map((entry) => entry.id)).size === entries.length
const healthKeys: (keyof HealthStats)[] = ['blood', 'uric', 'chol', 'liver', 'sugar']

describe('game content definitions', () => {
  it('meets required content counts', () => {
    expect(enemies.length).toBeGreaterThanOrEqual(50)
    expect(foods.length).toBeGreaterThanOrEqual(80)
    expect(fish.length).toBeGreaterThanOrEqual(30)
    expect(npcs.length).toBeGreaterThanOrEqual(15)
    expect(skills.length).toBeGreaterThanOrEqual(30)
    expect(quests.length).toBeGreaterThanOrEqual(25)
    expect(events.length).toBeGreaterThanOrEqual(100)
    expect(endings.length).toBeGreaterThanOrEqual(12)
  })

  it('does not contain duplicate IDs within each content table', () => {
    for (const table of [enemies, items, foods, fish, npcs, skills, quests, events, endings]) {
      expect(hasUniqueIds(table)).toBe(true)
    }
  })

  it('defines enemies with valid required fields, categories, drops, and health damage', () => {
    const categories = new Set<EnemyCategory>(['yokocho', 'office', 'health', 'boss', 'event'])
    expect(new Set(enemies.map((enemy) => enemy.category))).toEqual(categories)

    for (const enemy of enemies) {
      expect(enemy.id).toMatch(/^enemy_\d{3}$/)
      expect(enemy.name.length).toBeGreaterThan(0)
      expect(enemy.hp).toBeGreaterThan(0)
      expect(enemy.atk).toBeGreaterThanOrEqual(0)
      expect(enemy.def).toBeGreaterThanOrEqual(0)
      expect(enemy.xp).toBeGreaterThanOrEqual(0)
      expect(enemy.gold).toBeGreaterThanOrEqual(0)
      expect(categories.has(enemy.category)).toBe(true)
      expect(enemy.sprite.w).toBeGreaterThan(0)
      expect(enemy.sprite.h).toBeGreaterThan(0)
      for (const drop of enemy.drops) {
        expect(drop.itemId.length).toBeGreaterThan(0)
        expect(drop.rate).toBeGreaterThanOrEqual(0)
        expect(drop.rate).toBeLessThanOrEqual(1)
      }
      for (const key of healthKeys) {
        expect(enemy.healthDamage[key]).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('defines foods with recovery, health changes, calories, and nutrition ranges', () => {
    for (const food of foods) {
      expect(['food', 'drink']).toContain(food.category)
      expect(food.effect.hp).toBeGreaterThan(0)
      expect(food.effect.health).toBeDefined()
      expect(food.effect.calories).toBe(food.calories)
      expect(food.calories).toBeGreaterThan(0)
      expect(food.price).toBeGreaterThanOrEqual(0)
      expect(food.stackable).toBe(true)
      expect(food.nutrition.protein).toBeGreaterThanOrEqual(0)
      expect(food.nutrition.fat).toBeGreaterThanOrEqual(0)
      expect(food.nutrition.carbs).toBeGreaterThanOrEqual(0)
      expect(food.nutrition.salt).toBeGreaterThanOrEqual(0)
    }
  })

  it('defines fish with valid rarity, size, availability, and difficulty ranges', () => {
    for (const targetFish of fish) {
      expect(targetFish.rarity).toBeGreaterThanOrEqual(1)
      expect(targetFish.rarity).toBeLessThanOrEqual(5)
      expect(targetFish.size[0]).toBeGreaterThan(0)
      expect(targetFish.size[1]).toBeGreaterThanOrEqual(targetFish.size[0])
      expect(targetFish.sellPrice).toBeGreaterThan(0)
      expect(targetFish.timeSlots.length).toBeGreaterThan(0)
      expect(targetFish.seasons.length).toBeGreaterThan(0)
      expect(targetFish.locations.length).toBeGreaterThan(0)
      expect(targetFish.difficulty).toBeGreaterThanOrEqual(1)
      expect(targetFish.difficulty).toBeLessThanOrEqual(10)
    }
  })

  it('includes required NPC roles and valid dialog data', () => {
    const npcText = npcs.map((npc) => `${npc.name} ${npc.dialogs.map((dialog) => dialog.text).join(' ')}`).join(' ')
    for (const role of ['医師', 'トレーナー', '店主', '同僚', '上司', '後輩', 'バーテンダー', '釣り師', '料理人']) {
      expect(npcText).toContain(role)
    }
    for (const npc of npcs) {
      expect(npc.relationMax).toBeGreaterThan(0)
      expect(npc.dialogs.length).toBeGreaterThan(0)
    }
  })

  it('defines skills, quests, events, and endings with valid ranges', () => {
    for (const skill of skills) {
      expect(['physical', 'social', 'discipline']).toContain(skill.tree)
      expect(skill.cost).toBeGreaterThan(0)
      expect(skill.level).toBeGreaterThan(0)
      expect(Object.keys(skill.effect).length).toBeGreaterThan(0)
    }
    for (const quest of quests) {
      expect(quest.target.count).toBeGreaterThan(0)
      expect(quest.reward.gold ?? 0).toBeGreaterThanOrEqual(0)
      expect(quest.reward.xp ?? 0).toBeGreaterThanOrEqual(0)
    }
    for (const event of events) {
      expect(event.scenes.length).toBeGreaterThan(0)
      expect(['story', 'random', 'weekday', 'relation', 'season', 'health']).toContain(event.type)
      expect(['tile', 'talk', 'time', 'flag', 'health', 'auto']).toContain(event.trigger.type)
    }
    for (const ending of endings) {
      expect(ending.priority).toBeGreaterThan(0)
      expect(Object.keys(ending.condition).length).toBeGreaterThan(0)
    }
  })
})
