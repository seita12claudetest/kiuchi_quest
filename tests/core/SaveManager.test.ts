import { describe, it, expect, beforeEach } from 'vitest'
import {
  AUTO_SAVE_SLOT,
  MANUAL_SAVE_SLOTS,
  SAVE_DATA_VERSION,
  SaveManager,
  createInitialSaveData,
  type SaveStorage
} from '@/core/SaveManager'

class MemoryStorage implements SaveStorage {
  values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }

  removeItem(key: string): void {
    this.values.delete(key)
  }
}

describe('SaveManager', () => {
  let storage: MemoryStorage
  let manager: SaveManager

  beforeEach(() => {
    storage = new MemoryStorage()
    manager = new SaveManager({ storage })
  })

  it('should provide three manual slots and one auto save slot', () => {
    expect(MANUAL_SAVE_SLOTS).toEqual([1, 2, 3])
    expect(AUTO_SAVE_SLOT).toBe('auto')
  })

  it('should save and load SaveData from storage', async () => {
    const data = createInitialSaveData()
    data.state.player.gold = 123
    data.inventory.ramen = 2

    await manager.save(1, data)
    const loaded = await manager.load(1)

    expect(loaded).toEqual(data)
  })

  it('should keep manual slots independent', async () => {
    const slot1 = createInitialSaveData()
    const slot2 = createInitialSaveData()
    slot1.state.player.gold = 100
    slot2.state.player.gold = 200

    await manager.save(1, slot1)
    await manager.save(2, slot2)

    expect((await manager.load(1)).state.player.gold).toBe(100)
    expect((await manager.load(2)).state.player.gold).toBe(200)
  })

  it('should save auto save data separately', async () => {
    const manual = createInitialSaveData()
    const auto = createInitialSaveData()
    manual.state.currentMap = 'home'
    auto.state.currentMap = 'field'

    await manager.save(1, manual)
    await manager.autoSave(auto)

    expect((await manager.load(1)).state.currentMap).toBe('home')
    expect((await manager.load('auto')).state.currentMap).toBe('field')
  })

  it('should use SaveData.version for migrated saves', async () => {
    const data = createInitialSaveData()
    data.version = 0

    await manager.save(1, data)
    const loaded = await manager.load(1)

    expect(loaded.version).toBe(SAVE_DATA_VERSION)
  })

  it('should safely return initial data when a save is missing', async () => {
    await expect(manager.load(3)).resolves.toEqual(createInitialSaveData())
  })

  it('should safely return initial data when JSON is broken', async () => {
    storage.setItem(manager.getSlotKey(1), '{broken')

    await expect(manager.load(1)).resolves.toEqual(createInitialSaveData())
  })

  it('should safely return initial data when data shape is invalid', async () => {
    storage.setItem(manager.getSlotKey(1), JSON.stringify({ version: SAVE_DATA_VERSION }))

    await expect(manager.load(1)).resolves.toEqual(createInitialSaveData())
  })

  it('should expose trigger helpers for home, menu, and auto save timing', () => {
    expect(manager.getSlotForTrigger('home', 2)).toBe(2)
    expect(manager.getSlotForTrigger('menu', 3)).toBe(3)
    expect(manager.getSlotForTrigger('auto', 1)).toBe('auto')
  })
})
