# [Stream E] ゲームシステム — 残りのシステムロジック統合

## 概要
Phase 1で基盤実装済みのシステム(Battle, Health, Casino, Fishing)に加え、
残りのゲームシステム(Quest, Inventory, Skill, Relation, Time)を実装する。

## 前提条件
- `src/types/index.ts` 全型を参照
- `src/systems/BattleSystem.ts` 等のPhase1実装を参照
- Stream Bのデータ定義を利用する

## 作業内容

### 1. QuestSystem (`src/systems/QuestSystem.ts`)
- クエスト開始/進行/完了/報酬受取
- 進捗トラッキング (kill/collect/talk/visit/fish/cook等)
- 前提条件チェック
- API: `startQuest()`, `updateProgress()`, `checkCompletion()`, `claimReward()`

### 2. InventorySystem (`src/systems/InventorySystem.ts`)
- アイテム追加/削除/使用
- スタック管理 (stackable: true のアイテム)
- 装備着脱 (weapon/armor/accessory1/accessory2)
- 装備効果の適用/解除
- 重量/容量制限なし（軽量設計）
- API: `addItem()`, `removeItem()`, `useItem()`, `equip()`, `unequip()`

### 3. SkillSystem (`src/systems/SkillSystem.ts`)
- SP消費でスキル習得
- 前提スキルチェック
- スキル効果の適用（パッシブ/アクティブ）
- 3系統ツリー管理
- API: `canLearn()`, `learnSkill()`, `getActiveSkills()`, `getPassiveEffects()`

### 4. RelationSystem (`src/systems/RelationSystem.ts`)
- NPC好感度の増減
- 段階的イベント解放 (20/40/60/80/100)
- 好感度MAX判定
- API: `addRelation()`, `getRelation()`, `getUnlockedEvents()`

### 5. TimeSystem (`src/systems/TimeSystem.ts`)
- 1日4ターン (morning/noon/evening/night)
- 曜日計算 (day % 7)
- 季節計算 (30日=1月, 4月で1年)
- 時間経過イベント発火
- API: `advanceTime()`, `getWeekday()`, `getSeason()`, `getDayOfMonth()`

### 6. EventEngine (`src/systems/EventEngine.ts`)
- イベント発火条件チェック
- フラグ管理
- シーン進行（テキスト→選択肢→効果適用）
- EventDef を受け取って実行する汎用エンジン
- API: `checkTrigger()`, `startEvent()`, `processChoice()`, `applyEffect()`

### 7. FoodSystem (`src/systems/FoodSystem.ts`)
- 食事効果適用
- カロリー/栄養計算
- レシピ判定（素材チェック→料理生成）
- 食事ログ記録
- API: `eat()`, `cook()`, `canCook()`, `getFoodLog()`

## TDDテスト
```
tests/systems/QuestSystem.test.ts     - 進捗更新、完了判定、前提条件
tests/systems/InventorySystem.test.ts - 追加/削除/使用/装備
tests/systems/SkillSystem.test.ts     - SP消費、前提チェック、効果適用
tests/systems/RelationSystem.test.ts  - 増減、段階解放
tests/systems/TimeSystem.test.ts      - 時間進行、曜日、季節
tests/systems/EventEngine.test.ts     - 条件チェック、フラグ、効果適用
tests/systems/FoodSystem.test.ts      - 食事効果、レシピ判定
```

## 完了条件
- [ ] 全システムの単体テストパス
- [ ] システム間連携のインテグレーションテスト
- [ ] EventEngineが100+イベントデータを正しく処理できる
- [ ] 全APIが pure function 的（状態を受け取って新状態を返す）

## 軽量化ポイント
- 全システムはステートレス設計（状態はGameStateに集約）
- 条件チェックは early return で不要な計算をスキップ
- イベント検索はMap/Setで O(1) ルックアップ
- 毎フレーム呼ばない（イベント駆動: 行動時のみ実行）
