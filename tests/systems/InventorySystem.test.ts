import { describe, it, expect } from 'vitest'
import { InventorySystem } from '@/systems/InventorySystem'
import type { ItemDef, SaveData } from '@/types'

function save(overrides: Partial<SaveData> = {}): SaveData {
  return {
    version: 1,
    state: { player: { x: 0, y: 0, level: 1, xp: 0, nextXp: 10, hp: 5, maxHp: 20, power: 1, def: 1, gold: 0, health: { blood: 100, uric: 5, chol: 180, liver: 30, sugar: 90 }, belly: 0, special: 0, equipment: { weapon: null, armor: null, accessory1: null, accessory2: null }, skills: [], sp: 0 }, currentMap: 'home', day: 1, timeSlot: 'morning', flags: {}, mode: 'map' },
    inventory: {}, quests: {}, relations: {}, dex: { enemies: {}, items: {}, fish: {}, food: {} }, achievements: [], titles: [], endings: [], foodLog: [], fishLog: {}, playtime: 0,
    ...overrides,
  }
}
const potion: ItemDef = { id: 'potion', name: '薬', desc: '', category: 'medicine', icon: '💊', effect: { hp: 10 }, price: 10, stackable: true }
const sword: ItemDef = { id: 'sword', name: '剣', desc: '', category: 'equipment', icon: '🗡️', effect: { power: 3 }, price: 100, stackable: false }

describe('InventorySystem', () => {
  it('adds and removes items', () => {
    const sys = new InventorySystem()
    const added = sys.addItem(save(), 'potion', 3)
    expect(added.inventory.potion).toBe(3)
    expect(sys.removeItem(added, 'potion', 2).inventory.potion).toBe(1)
  })

  it('uses consumable item effects and consumes one item', () => {
    const sys = new InventorySystem()
    const result = sys.useItem(sys.addItem(save(), 'potion', 1), potion)
    expect(result.state.player.hp).toBe(15)
    expect(result.inventory.potion).toBeUndefined()
  })

  it('equips and unequips equipment through inventory', () => {
    const sys = new InventorySystem()
    const equipped = sys.equip(sys.addItem(save(), 'sword', 1), sword)
    expect(equipped.state.player.equipment.weapon).toBe('sword')
    expect(equipped.inventory.sword).toBeUndefined()
    const unequipped = sys.unequip(equipped, 'weapon')
    expect(unequipped.state.player.equipment.weapon).toBeNull()
    expect(unequipped.inventory.sword).toBe(1)
  })
})
