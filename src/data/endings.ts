export interface EndingDef { id: string; name: string; desc: string; condition: { flags?: Record<string, boolean>; minLevel?: number; healthScoreMax?: number; relationTotalMin?: number; questDoneMin?: number }; priority: number }

export const endings: EndingDef[] = [
  { id: 'ending_001', name: '健康王', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 5, healthScoreMax: 500, relationTotalMin: 0, questDoneMin: 1 }, priority: 100 },
  { id: 'ending_002', name: '横丁伝説', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 6, healthScoreMax: 490, relationTotalMin: 5, questDoneMin: 2 }, priority: 99 },
  { id: 'ending_003', name: '仕事人', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 7, healthScoreMax: 480, relationTotalMin: 10, questDoneMin: 3 }, priority: 98 },
  { id: 'ending_004', name: '釣り名人', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 8, healthScoreMax: 470, relationTotalMin: 15, questDoneMin: 4 }, priority: 97 },
  { id: 'ending_005', name: '美食家', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 9, healthScoreMax: 460, relationTotalMin: 20, questDoneMin: 5 }, priority: 96 },
  { id: 'ending_006', name: '節制者', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 10, healthScoreMax: 450, relationTotalMin: 25, questDoneMin: 6 }, priority: 95 },
  { id: 'ending_007', name: '人気者', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 11, healthScoreMax: 440, relationTotalMin: 30, questDoneMin: 7 }, priority: 94 },
  { id: 'ending_008', name: '成長株', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 12, healthScoreMax: 430, relationTotalMin: 35, questDoneMin: 8 }, priority: 93 },
  { id: 'ending_009', name: '夜の帝王', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 13, healthScoreMax: 420, relationTotalMin: 40, questDoneMin: 9 }, priority: 92 },
  { id: 'ending_010', name: '定時の勇者', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 14, healthScoreMax: 410, relationTotalMin: 45, questDoneMin: 10 }, priority: 91 },
  { id: 'ending_011', name: '検診満点', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 15, healthScoreMax: 400, relationTotalMin: 50, questDoneMin: 11 }, priority: 90 },
  { id: 'ending_012', name: '料理長', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 16, healthScoreMax: 390, relationTotalMin: 55, questDoneMin: 12 }, priority: 89 },
  { id: 'ending_013', name: '大富豪', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 17, healthScoreMax: 380, relationTotalMin: 60, questDoneMin: 13 }, priority: 88 },
  { id: 'ending_014', name: '普通の幸せ', desc: '木内がたどり着いた未来のひとつ。', condition: { minLevel: 18, healthScoreMax: 370, relationTotalMin: 65, questDoneMin: 14 }, priority: 87 }
]
