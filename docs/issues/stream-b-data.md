# [Stream B] データ定義 — 敵50種, NPC, イベント100+, 食べ物80種, 魚30種

## 概要
ゲーム内の全データコンテンツを `src/data/` 配下に定義する。
型は `src/types/index.ts` に準拠。純粋なデータ定義のみ（ロジック無し）。

## 前提条件
- `src/types/index.ts` の型定義を参照すること
- ロジックは書かない。データのみ export する

## 作業内容

### 1. 敵データ (`src/data/enemies.ts`)
- 50種以上の敵を定義
- カテゴリ分類: yokocho(15), office(12), health(13), boss(10)
- 各敵: id, name, hp, atk, def, xp, gold, drops, healthDamage, category, sprite
- ボスは boss:true, skills[] あり
- テーマ: 飲み会の敵、オフィスの試練、健康リスクの擬人化

### 2. NPCデータ (`src/data/npcs.ts`)
- 15人以上のNPC
- 各NPC: id, name, sprite, dialogs[], relationMax
- 主要NPC: 店主, 医師, トレーナー, 同僚, 上司, 後輩, バーテンダー, 謎の老人, 釣り師, 料理人...
- ダイアログは条件分岐付き

### 3. アイテムデータ (`src/data/items.ts`)
- 80種以上
- カテゴリ: food, drink, medicine, equipment, material, key, fish
- 各アイテム: id, name, desc, category, icon(絵文字), effect, price, stackable

### 4. 食べ物データ (`src/data/foods.ts`)
- 80種以上の食べ物 (FoodDef型)
- カテゴリ: おつまみ, 主食, デザート, ドリンク, 健康食, ジャンクフード
- 各食べ物: calories, nutrition(protein/fat/carbs/salt), recipe(任意)
- 絵文字アイコン付き
- 例: 🍺ビール, 🍶日本酒, 🍖焼き鳥, 🥗サラダ, 🍣寿司, 🍜ラーメン...

### 5. 魚データ (`src/data/fish.ts`)
- 30種以上 (FishDef型)
- レア度1-5, サイズ範囲, 出現時間帯, 季節, 釣り場, 難易度
- 例: アジ(★1), マダイ(★3), クロマグロ(★5)...

### 6. スキルデータ (`src/data/skills.ts`)
- 30種 (SkillDef型)
- 3系統: physical(10), social(10), discipline(10)
- 前提条件あり（ツリー構造）

### 7. クエストデータ (`src/data/quests.ts`)
- 25種以上 (QuestDef型)
- メイン/サブ/隠し

### 8. イベントデータ (`src/data/events.ts`)
- 100種以上 (EventDef型)
- タイプ: story(30), random(25), weekday(15), relation(15), season(10), health(10)
- 各イベント: trigger, condition, scenes[], reward
- フラグで分岐

### 9. エンディングデータ (`src/data/endings.ts`)
- 12種以上
- 条件と達成テキスト

## TDDテスト（先に書く）
```
tests/data/enemies.test.ts   - 50種存在、全フィールド検証、ID重複なし
tests/data/items.test.ts     - 全アイテムの型検証、価格>0
tests/data/foods.test.ts     - 80種存在、calories>0、nutrition合計妥当
tests/data/fish.test.ts      - 30種、rarity範囲、size[0]<size[1]
tests/data/events.test.ts    - 100種、trigger/condition整合性
```

## 完了条件
- [ ] 全データが型チェック通過
- [ ] ID重複なし（テストで保証）
- [ ] データバリデーションテスト全パス
- [ ] 敵50種, NPC15+, アイテム80+, 食べ物80+, 魚30+, イベント100+

## 軽量化ポイント
- データは `as const` で定義し、Tree-shakingで未使用データを除外可能に
- スプライト座標はアトラス1枚想定（個別画像ロード不要）

## 素材参考
- 食べ物画像: 絵文字 + Canvas描画で装飾（外部画像不要）
- 敵スプライト: OpenGameArt.org から CC0/CC-BY 素材を探索
- https://opengameart.org/
