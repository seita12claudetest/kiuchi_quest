import type { ItemDef, SaveData } from '@/types'

export type EquipmentSlot = keyof SaveData['state']['player']['equipment']

export class InventorySystem {
  addItem(save: SaveData, itemId: string, quantity = 1): SaveData {
    if (quantity <= 0) return save
    return {
      ...save,
      inventory: {
        ...save.inventory,
        [itemId]: (save.inventory[itemId] ?? 0) + quantity,
      },
      dex: {
        ...save.dex,
        items: { ...save.dex.items, [itemId]: true },
      },
    }
  }

  removeItem(save: SaveData, itemId: string, quantity = 1): SaveData {
    if (quantity <= 0 || (save.inventory[itemId] ?? 0) < quantity) return save
    const inventory = { ...save.inventory, [itemId]: save.inventory[itemId] - quantity }
    if (inventory[itemId] <= 0) delete inventory[itemId]
    return { ...save, inventory }
  }

  useItem(save: SaveData, item: ItemDef): SaveData {
    if ((save.inventory[item.id] ?? 0) <= 0 || item.category === 'equipment' || item.category === 'key') return save
    const player = save.state.player
    const effect = item.effect
    const next = this.removeItem(save, item.id, 1)
    return {
      ...next,
      state: {
        ...next.state,
        player: {
          ...player,
          hp: Math.min(player.maxHp, player.hp + (effect.hp ?? 0)),
          power: player.power + (effect.power ?? 0),
          def: player.def + (effect.def ?? 0),
          special: player.special + (effect.special ?? 0),
          belly: player.belly + ((effect.calories ?? 0) / 1000),
          health: {
            blood: player.health.blood + (effect.health?.blood ?? 0),
            uric: player.health.uric + (effect.health?.uric ?? 0),
            chol: player.health.chol + (effect.health?.chol ?? 0),
            liver: player.health.liver + (effect.health?.liver ?? 0),
            sugar: player.health.sugar + (effect.health?.sugar ?? 0),
          },
        },
      },
    }
  }

  equip(save: SaveData, item: ItemDef, slot: EquipmentSlot = this.inferSlot(item)): SaveData {
    if (item.category !== 'equipment' || (save.inventory[item.id] ?? 0) <= 0) return save
    const equipped = save.state.player.equipment[slot]
    let next = this.removeItem(save, item.id, 1)
    if (equipped) next = this.addItem(next, equipped, 1)
    return {
      ...next,
      state: {
        ...next.state,
        player: {
          ...next.state.player,
          equipment: { ...next.state.player.equipment, [slot]: item.id },
        },
      },
    }
  }

  unequip(save: SaveData, slot: EquipmentSlot): SaveData {
    const itemId = save.state.player.equipment[slot]
    if (!itemId) return save
    const next = this.addItem(save, itemId, 1)
    return {
      ...next,
      state: {
        ...next.state,
        player: {
          ...next.state.player,
          equipment: { ...next.state.player.equipment, [slot]: null },
        },
      },
    }
  }

  private inferSlot(item: ItemDef): EquipmentSlot {
    if ((item.effect.power ?? 0) > 0) return 'weapon'
    if ((item.effect.def ?? 0) > 0) return 'armor'
    return 'accessory1'
  }
}
