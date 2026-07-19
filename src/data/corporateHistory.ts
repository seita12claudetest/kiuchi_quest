export type CorporateHistoryEvent = {
  year: number
  title: string
  line: string
  theme: 'technology' | 'economy' | 'workstyle' | 'jtc'
  effect: { performance?: number; trust?: number; expertise?: number; politics?: number; stress?: number }
  source: string
}

export const corporateHistoryEvents: CorporateHistoryEvent[] = [
  { year: 1988, title: 'AS/400導入', line: '「紙の台帳が、画面の向こうへ引っ越していく……時代が動いてるな」', theme: 'technology', effect: { expertise: 3, stress: 1 }, source: 'IBM: The AS/400' },
  { year: 1991, title: 'バブルの余韻', line: '「景気はずっと続くって、課長は言うけど……本当かな」', theme: 'economy', effect: { trust: 1, stress: 2 }, source: '内閣府・景気基準日付' },
  { year: 1995, title: 'Windows 95の波', line: '「マウスで仕事？ 緑の画面のほうが速いんだけどな」', theme: 'technology', effect: { expertise: 2, stress: 1 }, source: 'Microsoft history / IBM i history' },
  { year: 2000, title: '2000年問題', line: '「日付が二桁だっただけで、正月が修羅場になるとは……」', theme: 'technology', effect: { performance: 5, expertise: 4, stress: 5 }, source: 'IPA 情報システム史資料' },
  { year: 2008, title: '急な予算凍結', line: '「昨日まで成長、今日から凍結。稟議書だけが取り残された」', theme: 'economy', effect: { politics: 2, stress: 4 }, source: '内閣府 年次経済財政報告' },
  { year: 2011, title: '事業継続計画', line: '「止めない仕組みは、普段から作っておくものなんだ」', theme: 'workstyle', effect: { trust: 4, expertise: 3 }, source: '内閣府 防災情報 BCP' },
  { year: 2020, title: '突然のテレワーク', line: '「ハンコを押すためだけに出社……これも仕事なのか？」', theme: 'jtc', effect: { performance: 2, politics: -1, stress: 2 }, source: '総務省 通信利用動向調査' },
  { year: 2024, title: '生成AI稟議', line: '「まず試す稟議を通すために、試さずに効果を書けと言われた」', theme: 'jtc', effect: { expertise: 4, politics: 3, stress: 2 }, source: '経済産業省 AI時代の人材育成資料' },
]
