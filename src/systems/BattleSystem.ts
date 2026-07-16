import type { PlayerState, EnemyDef } from '@/types'

export class BattleSystem {
  calcPlayerDamage(player: PlayerState, enemy: EnemyDef): number {
    const base = player.power - enemy.def + Math.floor(Math.random() * 5)
    return Math.max(1, base)
  }

  calcEnemyDamage(enemy: EnemyDef, player: PlayerState): number {
    const base = enemy.atk - player.def + Math.floor(Math.random() * 4)
    return Math.max(1, base)
  }

  calcSpecialDamage(player: PlayerState): number {
    return player.power * 4 + 12
  }

  canUseSpecial(player: PlayerState): boolean {
    return player.special >= 100
  }

  tryRun(): boolean {
    return Math.random() < 0.62
  }

  applyFatten(player: PlayerState): PlayerState {
    return {
      ...player,
      belly: player.belly + 0.08,
      power: player.power + 1,
      health: {
        ...player.health,
        blood: player.health.blood + 5,
        uric: player.health.uric + 0.2,
        chol: player.health.chol + 7,
      }
    }
  }

  applyVictoryHealthDamage(player: PlayerState, enemy: EnemyDef): PlayerState {
    const hd = enemy.healthDamage
    return {
      ...player,
      health: {
        blood: player.health.blood + hd.blood,
        uric: player.health.uric + hd.uric,
        chol: player.health.chol + hd.chol,
        liver: player.health.liver + hd.liver,
        sugar: player.health.sugar + hd.sugar,
      }
    }
  }

  applyVictoryRewards(player: PlayerState, enemy: EnemyDef): PlayerState {
    return {
      ...player,
      xp: player.xp + enemy.xp,
      gold: player.gold + enemy.gold,
    }
  }

  checkLevelUp(player: PlayerState, xpGain: number): PlayerState {
    let p = { ...player, xp: player.xp + xpGain }
    while (p.xp >= p.nextXp) {
      p = {
        ...p,
        xp: p.xp - p.nextXp,
        level: p.level + 1,
        nextXp: Math.floor(p.nextXp * 1.35),
        maxHp: p.maxHp + 8,
        hp: p.maxHp + 8,
        power: p.power + 2,
        def: p.def + 1,
        sp: p.sp + 1,
      }
    }
    return p
  }
}
