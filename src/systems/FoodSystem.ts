import type { FoodDef, SaveData } from '@/types'

export interface EatResult {
  ok: boolean
  message: string
  hpRecovered: number
  calories: number
}

export interface CookResult {
  ok: boolean
  message: string
  food?: FoodDef
}

export class FoodSystem {
  eat(save: SaveData, food: FoodDef): EatResult {
    const count = save.inventory[food.id] ?? 0
    if (count <= 0) {
      return { ok: false, message: `${food.name}を持っていない`, hpRecovered: 0, calories: 0 }
    }

    save.inventory[food.id] = count - 1
    if (save.inventory[food.id] <= 0) delete save.inventory[food.id]

    const player = save.state.player
    const hpBefore = player.hp
    const hpEffect = food.effect.hp ?? 0
    player.hp = Math.min(player.maxHp, Math.max(0, player.hp + hpEffect))

    const healthEffect = food.effect.health ?? {}
    player.health = {
      blood: Math.max(80, player.health.blood + (healthEffect.blood ?? 0)),
      uric: Math.max(3, player.health.uric + (healthEffect.uric ?? 0)),
      chol: Math.max(100, player.health.chol + (healthEffect.chol ?? 0)),
      liver: Math.max(10, player.health.liver + (healthEffect.liver ?? 0)),
      sugar: Math.max(60, player.health.sugar + (healthEffect.sugar ?? 0)),
    }

    const calories = food.effect.calories ?? food.calories
    player.belly += calories
    save.foodLog.push(`${save.state.day}:${save.state.timeSlot}:${food.id}:${calories}kcal`)
    save.dex.food[food.id] = true

    return {
      ok: true,
      message: `${food.name}を食べた`,
      hpRecovered: player.hp - hpBefore,
      calories,
    }
  }

  cook(save: SaveData, food: FoodDef): CookResult {
    if (!food.recipe || food.recipe.length === 0) {
      return { ok: false, message: `${food.name}は料理レシピではない` }
    }

    const missing = food.recipe.find(ingredient => (save.inventory[ingredient.itemId] ?? 0) < ingredient.quantity)
    if (missing) {
      return { ok: false, message: `素材が足りない: ${missing.itemId}` }
    }

    for (const ingredient of food.recipe) {
      save.inventory[ingredient.itemId] -= ingredient.quantity
      if (save.inventory[ingredient.itemId] <= 0) delete save.inventory[ingredient.itemId]
    }

    save.inventory[food.id] = (save.inventory[food.id] ?? 0) + 1
    save.dex.food[food.id] = true
    save.foodLog.push(`${save.state.day}:${save.state.timeSlot}:cook:${food.id}`)

    return { ok: true, message: `${food.name}を作った`, food }
  }
}
