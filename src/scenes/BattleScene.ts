import { getEnemyDef } from '@/data/enemies'
import { BattleSystem } from '@/systems/BattleSystem'
import type { BattleCommand, BattleState, EnemyDef, GameState, PlayerState } from '@/types'

export type BattleStatus = 'active' | 'victory' | 'defeat' | 'escaped'

export interface BattleDisplayState {
  enemyName: string
  enemyHp: number
  enemyMaxHp: number
  playerHp: number
  playerMaxHp: number
  log: string[]
  turn: number
  commands: BattleCommand[]
  bossCinematic: boolean
  status: BattleStatus
}

export interface BattleVictoryResult {
  xp: number
  gold: number
  drops: string[]
  healthDamage: EnemyDef['healthDamage']
  leveledUp: boolean
  level: number
  sp: number
}

export interface BattleCommandResult {
  status: BattleStatus
  player: PlayerState
  battle: BattleState
  victory?: BattleVictoryResult
  destination?: 'home' | 'hospital'
}

interface BattleSceneOptions {
  system?: BattleSystem
  rng?: () => number
}

const COMMANDS: BattleCommand[] = ['attack', 'skill', 'item', 'fatten', 'special', 'run']

export class BattleScene {
  readonly bossCinematic: boolean

  private player: PlayerState
  private readonly system: BattleSystem
  private readonly rng: () => number
  private status: BattleStatus = 'active'
  private battle: BattleState

  constructor(player: PlayerState, enemyIdOrDef: string | EnemyDef, options: BattleSceneOptions = {}) {
    const enemyDef = typeof enemyIdOrDef === 'string' ? getEnemyDef(enemyIdOrDef) : enemyIdOrDef
    this.player = { ...player }
    this.system = options.system ?? new BattleSystem(options.rng)
    this.rng = options.rng ?? Math.random
    this.bossCinematic = enemyDef.boss === true
    this.battle = {
      enemy: { def: enemyDef, hp: enemyDef.hp, maxHp: enemyDef.hp, buffs: [] },
      turn: 1,
      log: [`${enemyDef.name} が現れた！`],
      playerAction: null,
    }
  }

  getDisplayState(): BattleDisplayState {
    return {
      enemyName: this.battle.enemy.def.name,
      enemyHp: this.battle.enemy.hp,
      enemyMaxHp: this.battle.enemy.maxHp,
      playerHp: this.player.hp,
      playerMaxHp: this.player.maxHp,
      log: [...this.battle.log],
      turn: this.battle.turn,
      commands: [...COMMANDS],
      bossCinematic: this.bossCinematic,
      status: this.status,
    }
  }

  executeCommand(command: BattleCommand): BattleCommandResult {
    if (this.status !== 'active') return this.result()

    this.battle.playerAction = command
    switch (command) {
      case 'attack':
        this.playerAttack(this.system.calcPlayerDamage(this.player, this.battle.enemy.def), '攻撃')
        break
      case 'skill':
        this.useSkill()
        break
      case 'item':
        this.useItem()
        break
      case 'fatten':
        this.player = this.system.applyFatten(this.player)
        this.battle.log.push('ふとる覚悟で力をためた！')
        break
      case 'special':
        this.useSpecial()
        break
      case 'run':
        if (this.system.tryRun()) {
          this.status = 'escaped'
          this.battle.log.push('逃走に成功した。')
          return this.result()
        }
        this.battle.log.push('逃げられなかった！')
        break
    }

    if (this.battle.enemy.hp <= 0) return this.finishVictory()
    this.enemyAttack()
    if (this.player.hp <= 0) return this.finishDefeat()
    this.battle.turn += 1
    return this.result()
  }

  applyToGameState(gameState: GameState, result: BattleCommandResult): GameState {
    return {
      ...gameState,
      player: result.player,
      currentMap: result.destination ?? gameState.currentMap,
      mode: result.status === 'active' ? 'battle' : 'map',
      flags: {
        ...gameState.flags,
        bossBattle: this.bossCinematic,
      },
    }
  }

  private playerAttack(damage: number, label: string): void {
    this.battle.enemy.hp = Math.max(0, this.battle.enemy.hp - damage)
    this.battle.log.push(`${label}で ${damage} ダメージ！`)
  }

  private useSkill(): void {
    if (this.player.skills.length === 0) {
      this.battle.log.push('使えるスキルがない！')
      return
    }
    this.playerAttack(this.player.power * 2, `${this.player.skills[0]} スキル`)
  }

  private useItem(): void {
    const heal = Math.min(20, this.player.maxHp - this.player.hp)
    this.player = { ...this.player, hp: this.player.hp + heal }
    this.battle.log.push(`アイテムで HP を ${heal} 回復した。`)
  }

  private useSpecial(): void {
    if (!this.system.canUseSpecial(this.player)) {
      this.battle.log.push('必殺ゲージが足りない！')
      return
    }
    this.playerAttack(this.system.calcSpecialDamage(this.player), '必殺技')
    this.player = { ...this.player, special: 0 }
  }

  private enemyAttack(): void {
    const damage = this.system.calcEnemyDamage(this.battle.enemy.def, this.player)
    this.player = { ...this.player, hp: Math.max(0, this.player.hp - damage) }
    this.battle.log.push(`${this.battle.enemy.def.name} の攻撃。${damage} ダメージ！`)
  }

  private finishVictory(): BattleCommandResult {
    const beforeLevel = this.player.level
    const enemy = this.battle.enemy.def
    const drops = this.system.rollDrops(enemy)
    this.player = this.system.applyVictoryHealthDamage(this.player, enemy)
    this.player = { ...this.player, gold: this.player.gold + enemy.gold }
    this.player = this.system.checkLevelUp(this.player, enemy.xp)
    this.status = 'victory'
    this.battle.log.push(`${enemy.name} を倒した！`, `${enemy.xp} XP と ${enemy.gold} G を得た。`)
    for (const drop of drops) this.battle.log.push(`${drop} を手に入れた。`)
    return this.result({
      xp: enemy.xp,
      gold: enemy.gold,
      drops,
      healthDamage: enemy.healthDamage,
      leveledUp: this.player.level > beforeLevel,
      level: this.player.level,
      sp: this.player.sp,
    })
  }

  private finishDefeat(): BattleCommandResult {
    this.status = 'defeat'
    const destination = this.needsHospital() ? 'hospital' : 'home'
    this.player = { ...this.player, hp: Math.max(1, Math.floor(this.player.maxHp / 2)) }
    this.battle.log.push(destination === 'hospital' ? '病院で目を覚ました。' : '自宅で目を覚ました。')
    return this.result(undefined, destination)
  }

  private needsHospital(): boolean {
    return this.player.health.blood >= 160 || this.player.health.sugar >= 140 || this.player.health.liver >= 90
  }

  private result(victory?: BattleVictoryResult, destination?: 'home' | 'hospital'): BattleCommandResult {
    return { status: this.status, player: this.player, battle: this.battle, victory, destination }
  }
}
