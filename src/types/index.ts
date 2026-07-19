// ========================================
// 共通型定義 — 全ストリームがこの型に依存する
// ========================================

// --- Core ---
export interface GameState {
  player: PlayerState
  currentMap: string
  day: number
  timeSlot: TimeSlot
  flags: Record<string, boolean>
  mode: GameMode
  mealLog?: string[]
  eventLog?: string[]
  gymVisits?: number
  lastSavedAt?: { day: number; timeSlot: TimeSlot; map: string }
  career?: CareerState
  relations?: Record<string, number>
  questProgress?: Record<string, QuestProgress>
  workDays?: number
}

export type CareerRank = 'new_hire' | 'staff' | 'senior' | 'chief' | 'assistant_manager' | 'manager' | 'deputy_manager'

export interface CareerState {
  rank: CareerRank
  rankName: string
  performance: number
  trust: number
  expertise: number
  politics: number
  stress: number
  age: number
  year: number
  calendarMonth: number
  monthsAtRank: number
}

export type GameMode = 'map' | 'battle' | 'event' | 'menu' | 'casino' | 'fishing' | 'title'
export type TimeSlot = 'morning' | 'noon' | 'evening' | 'night'
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

// --- Player ---
export interface PlayerState {
  x: number
  y: number
  level: number
  xp: number
  nextXp: number
  hp: number
  maxHp: number
  power: number
  def: number
  gold: number
  health: HealthStats
  belly: number
  special: number
  equipment: Equipment
  skills: string[]
  sp: number
}

export interface HealthStats {
  blood: number      // 血圧
  uric: number       // 尿酸値
  chol: number       // コレステロール
  liver: number      // 肝機能 (γ-GTP)
  sugar: number      // 血糖値
}

export interface Equipment {
  weapon: string | null
  armor: string | null
  accessory1: string | null
  accessory2: string | null
}

// --- Enemy ---
export interface EnemyDef {
  id: string
  name: string
  hp: number
  atk: number
  def: number
  xp: number
  gold: number
  drops: DropEntry[]
  healthDamage: HealthDamage
  category: EnemyCategory
  sprite: SpriteRef
  skills?: string[]
  boss?: boolean
}

export type EnemyCategory = 'yokocho' | 'office' | 'health' | 'boss' | 'event'

export interface DropEntry {
  itemId: string
  rate: number // 0-1
}

export interface HealthDamage {
  blood: number
  uric: number
  chol: number
  liver: number
  sugar: number
}

// --- Battle ---
export type BattleCommand = 'attack' | 'skill' | 'item' | 'fatten' | 'special' | 'run'

export interface BattleState {
  enemy: EnemyInstance
  turn: number
  log: string[]
  playerAction: BattleCommand | null
}

export interface EnemyInstance {
  def: EnemyDef
  hp: number
  maxHp: number
  buffs: Buff[]
}

export interface Buff {
  id: string
  turns: number
  effect: Partial<{ atk: number; def: number; speed: number }>
}

// --- Item ---
export interface ItemDef {
  id: string
  name: string
  desc: string
  category: ItemCategory
  icon: string          // 絵文字
  spritePos?: [number, number] // アトラス座標
  effect: ItemEffect
  price: number
  stackable: boolean
}

export type ItemCategory = 'food' | 'drink' | 'medicine' | 'equipment' | 'material' | 'key' | 'fish'

export interface ItemEffect {
  hp?: number
  health?: Partial<HealthStats>
  buff?: Buff
  power?: number
  def?: number
  special?: number
  calories?: number
}

// --- Food (extends Item) ---
export interface FoodDef extends ItemDef {
  category: 'food' | 'drink'
  calories: number
  nutrition: NutritionInfo
  recipe?: RecipeIngredient[]
}

export interface NutritionInfo {
  protein: number
  fat: number
  carbs: number
  salt: number
}

export interface RecipeIngredient {
  itemId: string
  quantity: number
}

// --- Fish ---
export interface FishDef {
  id: string
  name: string
  icon: string
  rarity: 1 | 2 | 3 | 4 | 5
  size: [number, number]   // min-max cm
  sellPrice: number
  timeSlots: TimeSlot[]
  seasons: Season[]
  locations: string[]
  difficulty: number       // 1-10 引きの強さ
}

// --- Skill ---
export interface SkillDef {
  id: string
  name: string
  desc: string
  tree: SkillTree
  cost: number        // SP
  prereqs: string[]   // 前提スキルID
  effect: SkillEffect
  level: number       // ツリー内の段階
}

export type SkillTree = 'physical' | 'social' | 'discipline'

export interface SkillEffect {
  battlePower?: number
  battleDef?: number
  healthBonus?: Partial<HealthStats>
  passive?: string
}

// --- Map ---
export interface MapDef {
  id: string
  name: string
  width: number
  height: number
  tiles: number[][]           // タイルID 2D配列
  collisions: boolean[][]     // 通行可否
  npcs: MapNPC[]
  warps: WarpPoint[]
  encounterRate: number       // 0-1
  enemyPool: string[]         // 敵ID
  bgm?: string
  facilityEventId?: string
}

export interface MapNPC {
  id: string
  x: number
  y: number
  sprite: SpriteRef
}

export interface WarpPoint {
  x: number
  y: number
  targetMap: string
  targetX: number
  targetY: number
}

// --- NPC ---
export interface NPCDef {
  id: string
  name: string
  sprite: SpriteRef
  dialogs: DialogNode[]
  relationMax: number
}

export interface DialogNode {
  id: string
  text: string
  condition?: EventCondition
  choices?: DialogChoice[]
  next?: string
}

export interface DialogChoice {
  label: string
  next: string
  effect?: EventEffect
}

// --- Event ---
export interface EventDef {
  id: string
  name: string
  type: EventType
  trigger: EventTrigger
  condition?: EventCondition
  scenes: EventScene[]
  reward?: EventReward
  repeatable: boolean
}

export type EventType = 'story' | 'random' | 'weekday' | 'relation' | 'season' | 'health' | 'facility'

export interface EventTrigger {
  type: 'tile' | 'talk' | 'time' | 'flag' | 'health' | 'auto'
  value?: string | number
}

export interface EventCondition {
  flags?: Record<string, boolean>
  minRelation?: Record<string, number>
  minLevel?: number
  dayRange?: [number, number]
  health?: Partial<Record<keyof HealthStats, { min?: number; max?: number }>>
  weekday?: Weekday[]
  season?: Season[]
}

export interface EventScene {
  text: string
  speaker?: string
  sprite?: SpriteRef
  choices?: EventChoice[]
  effect?: EventEffect
}

export interface EventChoice {
  label: string
  nextScene: number
  effect?: EventEffect
}

export interface EventEffect {
  setFlags?: Record<string, boolean>
  gold?: number
  xp?: number
  items?: { id: string; qty: number }[]
  health?: Partial<HealthStats>
  relation?: Record<string, number>
  hp?: number
  advanceTime?: number
  rest?: boolean
  cook?: { meal: string; belly: number }
  save?: boolean
  hospital?: boolean
  gym?: { rewardEvery: number; power: number; sp: number }
}

export interface EventReward {
  gold?: number
  xp?: number
  items?: { id: string; qty: number }[]
  title?: string
  achievement?: string
}

// --- Quest ---
export interface QuestDef {
  id: string
  name: string
  desc: string
  target: QuestTarget
  reward: EventReward
  prereqs?: string[] // 前提クエストID
}

export interface QuestTarget {
  type: 'kill' | 'collect' | 'talk' | 'visit' | 'fish' | 'cook' | 'casino' | 'gym' | 'custom'
  targetId?: string
  count: number
}

// --- Casino ---
export type CasinoGame = 'slot' | 'blackjack' | 'poker' | 'roulette'

export interface CasinoResult {
  game: CasinoGame
  bet: number
  payout: number
  won: boolean
}

// --- Rendering ---
export interface SpriteRef {
  atlas: string
  x: number
  y: number
  w: number
  h: number
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

// --- Scene Interface ---
export interface Scene {
  enter(state: GameState): void
  exit(): void
  update(dt: number, state: GameState): void
  render(ctx: CanvasRenderingContext2D, state: GameState): void
  handleInput(key: string, state: GameState): void
}

// --- Save ---
export interface SaveData {
  version: number
  state: GameState
  inventory: Record<string, number>
  quests: Record<string, QuestProgress>
  relations: Record<string, number>
  dex: DexData
  achievements: string[]
  titles: string[]
  endings: string[]
  foodLog: string[]
  fishLog: Record<string, FishRecord>
  playtime: number
}

export interface QuestProgress {
  started: boolean
  done: boolean
  claimed: boolean
  progress: number
}

export interface DexData {
  enemies: Record<string, number>
  items: Record<string, boolean>
  fish: Record<string, FishRecord>
  food: Record<string, boolean>
}

export interface FishRecord {
  caught: number
  maxSize: number
}
