import type { GameState, SaveData } from '@/types'

export const SAVE_DATA_VERSION = 1
export const MANUAL_SAVE_SLOTS = [1, 2, 3] as const
export const AUTO_SAVE_SLOT = 'auto'
export type ManualSaveSlot = typeof MANUAL_SAVE_SLOTS[number]
export type SaveSlot = ManualSaveSlot | typeof AUTO_SAVE_SLOT
export type SaveTrigger = 'home' | 'menu' | 'auto'

export interface SaveStorage {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
}

export interface SaveManagerOptions {
  storage?: SaveStorage
  keyPrefix?: string
  initialData?: () => SaveData
}

const DEFAULT_KEY_PREFIX = 'kiuchi_quest:save'

const createInitialGameState = (): GameState => ({
  player: {
    x: 0,
    y: 0,
    level: 1,
    xp: 0,
    nextXp: 10,
    hp: 100,
    maxHp: 100,
    power: 10,
    def: 5,
    gold: 0,
    health: {
      blood: 100,
      uric: 5,
      chol: 180,
      liver: 30,
      sugar: 90
    },
    belly: 100,
    special: 0,
    equipment: {
      weapon: null,
      armor: null,
      accessory1: null,
      accessory2: null
    },
    skills: [],
    sp: 0
  },
  currentMap: 'home',
  day: 1,
  timeSlot: 'morning',
  flags: {},
  mode: 'title'
})

export const createInitialSaveData = (): SaveData => ({
  version: SAVE_DATA_VERSION,
  state: createInitialGameState(),
  inventory: {},
  quests: {},
  relations: {},
  dex: {
    enemies: {},
    items: {},
    fish: {},
    food: {}
  },
  achievements: [],
  titles: [],
  endings: [],
  foodLog: [],
  fishLog: {},
  playtime: 0
})

class LocalStorageAdapter implements SaveStorage {
  constructor(private readonly localStorageRef: Storage) {}

  getItem(key: string): string | null {
    return this.localStorageRef.getItem(key)
  }

  setItem(key: string, value: string): void {
    this.localStorageRef.setItem(key, value)
  }

  removeItem(key: string): void {
    this.localStorageRef.removeItem(key)
  }
}

const getDefaultStorage = (): SaveStorage | null => {
  if (typeof globalThis.localStorage === 'undefined') return null
  return new LocalStorageAdapter(globalThis.localStorage)
}

const cloneSaveData = (data: SaveData): SaveData => JSON.parse(JSON.stringify(data)) as SaveData

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isValidSaveData = (value: unknown): value is SaveData => {
  if (!isRecord(value)) return false
  return typeof value.version === 'number'
    && isRecord(value.state)
    && isRecord(value.inventory)
    && isRecord(value.quests)
    && isRecord(value.relations)
    && isRecord(value.dex)
    && Array.isArray(value.achievements)
    && Array.isArray(value.titles)
    && Array.isArray(value.endings)
    && Array.isArray(value.foodLog)
    && isRecord(value.fishLog)
    && typeof value.playtime === 'number'
}

export class SaveManager {
  private readonly storage: SaveStorage | null
  private readonly keyPrefix: string
  private readonly initialData: () => SaveData

  constructor(options: SaveManagerOptions = {}) {
    this.storage = options.storage ?? getDefaultStorage()
    this.keyPrefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX
    this.initialData = options.initialData ?? createInitialSaveData
  }

  getInitialData(): SaveData {
    return cloneSaveData(this.initialData())
  }

  getSlotKey(slot: SaveSlot): string {
    return `${this.keyPrefix}:${slot}`
  }

  async save(slot: SaveSlot, data: SaveData): Promise<void> {
    const storage = this.requireStorage()
    const migrated = this.migrate(data)
    await storage.setItem(this.getSlotKey(slot), JSON.stringify(migrated))
  }

  async load(slot: SaveSlot): Promise<SaveData> {
    try {
      if (!this.storage) return this.getInitialData()
      const raw = await this.storage.getItem(this.getSlotKey(slot))
      if (!raw) return this.getInitialData()

      const parsed = JSON.parse(raw) as unknown
      if (!isValidSaveData(parsed)) return this.getInitialData()

      return this.migrate(parsed)
    } catch {
      return this.getInitialData()
    }
  }

  async clear(slot: SaveSlot): Promise<void> {
    if (!this.storage) return
    await this.storage.removeItem(this.getSlotKey(slot))
  }

  async saveFromHome(data: SaveData, slot: ManualSaveSlot = 1): Promise<void> {
    await this.save(slot, data)
  }

  async saveFromMenu(data: SaveData, slot: ManualSaveSlot): Promise<void> {
    await this.save(slot, data)
  }

  async autoSave(data: SaveData): Promise<void> {
    await this.save(AUTO_SAVE_SLOT, data)
  }

  getSlotForTrigger(trigger: SaveTrigger, slot: ManualSaveSlot = 1): SaveSlot {
    return trigger === 'auto' ? AUTO_SAVE_SLOT : slot
  }

  private migrate(data: SaveData): SaveData {
    const migrated = cloneSaveData(data)

    if (migrated.version > SAVE_DATA_VERSION) {
      return this.getInitialData()
    }

    // Future migrations should be chained here by SaveData.version.
    migrated.version = SAVE_DATA_VERSION
    return migrated
  }

  private requireStorage(): SaveStorage {
    if (!this.storage) {
      throw new Error('Save storage is not available in this environment.')
    }
    return this.storage
  }
}
