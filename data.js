"use strict";

const GAME_DATA = Object.freeze({
  tileSize: 40,
  weekdays: ["月", "火", "水", "木", "金", "土", "日"],
  times: ["朝", "昼", "夕方", "夜"],
  map: [
    "##################",
    "#..Y....N.....Y..#",
    "#..Y..C.......Y..#",
    "#..YYYY..YYYY....#",
    "#......Y.Y....H..#",
    "#..N...Y.Y..N....#",
    "#......YYY.......#",
    "#..YYYY....YY.G..#",
    "#..Y..........Y..#",
    "#..Y....N.....Y..#",
    "#.....P....S.....#",
    "#................#",
    "##################"
  ],
  icons: { Y: "酒", N: "人", H: "病", G: "筋", C: "店", P: "公", S: "家" },
  enemies: [
    { name: "焼き鳥盛り合わせ", hp: 18, atk: 4, xp: 12, gold: 250, drop: "枝豆", health: [2, 0.1, 3] },
    { name: "締めラーメン", hp: 28, atk: 7, xp: 24, gold: 400, drop: "黒烏龍茶", health: [6, 0.3, 8] },
    { name: "ハイボール濃いめ", hp: 22, atk: 6, xp: 18, gold: 350, drop: "ミネラルウォーター", health: [5, 0.2, 4] },
    { name: "唐揚げ大皿", hp: 25, atk: 6, xp: 20, gold: 380, drop: "トマトジュース", health: [4, 0.2, 7] },
    { name: "二軒目の誘惑", hp: 34, atk: 8, xp: 35, gold: 600, drop: "帰宅宣言書", health: [8, 0.4, 10] }
  ],
  secretBoss: { name: "伝説の忘年会会長", hp: 120, atk: 14, xp: 250, gold: 5000, drop: "帰宅宣言書", health: [15, 0.8, 20] },
  items: {
    "ミネラルウォーター": { desc: "尿酸-0.4、HP+5", price: 120 },
    "黒烏龍茶": { desc: "コレステロール-12", price: 280 },
    "トマトジュース": { desc: "血圧-8、HP+8", price: 220 },
    "枝豆": { desc: "HP+12、尿酸-0.1", price: 180 },
    "プロテイン": { desc: "筋力+2、HP+15", price: 500 },
    "帰宅宣言書": { desc: "必殺ゲージMAX", price: 1200 },
    "降圧薬": { desc: "血圧-25", price: 1500 }
  },
  quests: [
    { id: "q1", name: "初めての一杯", desc: "敵を3体倒す", target: 3, key: "kills", reward: "プロテイン" },
    { id: "q2", name: "健康への第一歩", desc: "ジムを2回利用", target: 2, key: "gym", reward: "黒烏龍茶" },
    { id: "q3", name: "病院は怖くない", desc: "病院を1回利用", target: 1, key: "hospital", reward: "降圧薬" },
    { id: "q4", name: "横丁の顔", desc: "NPCと5回話す", target: 5, key: "talks", reward: "帰宅宣言書" },
    { id: "q5", name: "禁酒三日坊主", desc: "3日間、飲み会戦闘をせず日を進める", target: 3, key: "sober", reward: "トマトジュース" }
  ],
  npcTalk: [
    "百恵ちゃんの引退は伝説だったなあ。",
    "聖子ちゃんカットは横丁でも流行ったんだよ。",
    "明菜派か聖子派か、それが問題だ。",
    "ピンク・レディーの振付なら今でも少し踊れるぞ。",
    "おニャン子の会員番号、覚えてるかい？"
  ]
});
