# [Stream F] シーン実装 — Title, Map, Battle, Casino, Fishing, Menu

## 概要
各ゲームシーン（画面）を実装する。Scene インターフェースに準拠。
各シーンはシステム(Stream E)とUI(Stream C)を組み合わせて動作する。

## 前提条件
- Stream A (GameEngine, InputManager) 完了後に着手
- Stream C (UIコンポーネント) の基本パーツを利用
- Stream E (Systems) のロジックを呼び出す
- `src/types/index.ts` の `Scene` インターフェース準拠

## 作業内容

### 1. TitleScene (`src/scenes/TitleScene.ts`)
- ゲームタイトル表示（グロウエフェクト付き）
- メニュー: NEW GAME / CONTINUE / CONFIG
- 背景アニメーション（パーティクル or スクロール）
- BGM再生開始

### 2. MapScene (`src/scenes/MapScene.ts`)
- マップ描画 (MapRenderer利用)
- プレイヤー移動処理 (InputManager→移動)
- エンカウント判定
- タイルイベント発火 (施設入場, NPC会話)
- HUD表示
- マップ遷移処理 (WarpPoint)

### 3. BattleScene (`src/scenes/BattleScene.ts`)
- 敵表示（スプライト + 名前 + HPバー）
- コマンドメニュー（たたかう/スキル/アイテム/太る/必殺/にげる）
- 攻撃アニメーション/エフェクト
- ダメージ数字表示（浮き上がり）
- 勝利/敗北演出
- BGM切替

### 4. EventScene (`src/scenes/EventScene.ts`)
- 会話テキスト表示 (DialogBox利用)
- キャラ立ち絵表示
- 選択肢処理
- イベント効果適用
- 自動進行 / ユーザー入力待ち

### 5. CasinoScene (`src/scenes/CasinoScene.ts`)
- ゲーム選択メニュー（スロット/BJ/ポーカー/ルーレット）
- 各ゲームの描画/操作
- コイン残高表示
- 景品交換メニュー

### 6. FishingScene (`src/scenes/FishingScene.ts`)
- 釣りゲージ表示（タイミングバー）
- 魚の引きアニメーション
- 釣果表示（魚名/サイズ/レア度）
- 魚図鑑更新通知

### 7. MenuScene (`src/scenes/MenuScene.ts`)
- タブ切替: ステータス/装備/スキル/アイテム/クエスト/図鑑/設定
- 各タブの表示/操作
- オーバーレイ表示（マップシーンの上に重ねる）

### 8. ShopScene (`src/scenes/ShopScene.ts`)
- 商品リスト表示
- 購入/売却
- 所持金/在庫表示

## TDDテスト
```
tests/scenes/BattleScene.test.ts   - コマンド入力→状態遷移
tests/scenes/EventScene.test.ts    - テキスト進行、選択肢処理
tests/scenes/CasinoScene.test.ts   - ゲーム遷移、コイン管理
tests/scenes/FishingScene.test.ts  - タイミング判定、結果処理
```

## 完了条件
- [ ] 全シーンが正常に enter/exit/update/render する
- [ ] シーン間遷移が正しく動作
- [ ] 入力がシーンに正しくルーティングされる
- [ ] メモリリークなし（シーン切替時にリソース解放）

## 軽量化ポイント
- シーンは enter 時にリソース確保、exit 時に解放
- バトル/カジノ等は必要なデータのみメモリ保持
- 画面外の要素は update/render をスキップ
