import type { SaveData, SkillDef } from '@/types'

export class SkillSystem {
  hasSkill(save: SaveData, skillId: string): boolean {
    return save.state.player.skills.includes(skillId)
  }

  canLearn(save: SaveData, skill: SkillDef): boolean {
    return !this.hasSkill(save, skill.id)
      && save.state.player.sp >= skill.cost
      && skill.prereqs.every(id => this.hasSkill(save, id))
  }

  learn(save: SaveData, skill: SkillDef): SaveData {
    if (!this.canLearn(save, skill)) return save
    const player = save.state.player
    return {
      ...save,
      state: {
        ...save.state,
        player: {
          ...player,
          sp: player.sp - skill.cost,
          skills: [...player.skills, skill.id],
        },
      },
    }
  }
}
