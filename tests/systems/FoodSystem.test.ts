import { describe, expect, it } from 'vitest'
import { foods } from '@/data/foods'
import { FoodSystem } from '@/systems/FoodSystem'
import { makeSaveData } from '../helpers'

describe('FoodSystem', () => {
  it('updates hp, health, calories, dex and food log when eating', () => {
    const save = makeSaveData({ inventory: { grilled_ayu: 1 } })
    const result = new FoodSystem().eat(save, foods[0])

    expect(result.ok).toBe(true)
    expect(save.inventory.grilled_ayu).toBeUndefined()
    expect(save.state.player.hp).toBe(68)
    expect(save.state.player.health.chol).toBe(177)
    expect(save.state.player.belly).toBe(180)
    expect(save.dex.food.grilled_ayu).toBe(true)
    expect(save.foodLog[0]).toContain('grilled_ayu')
  })

  it('cooks food from fish materials', () => {
    const save = makeSaveData({ inventory: { 'fish:saba': 1 } })
    const result = new FoodSystem().cook(save, foods[1])

    expect(result.ok).toBe(true)
    expect(save.inventory['fish:saba']).toBeUndefined()
    expect(save.inventory.saba_miso).toBe(1)
    expect(save.dex.food.saba_miso).toBe(true)
  })
})
