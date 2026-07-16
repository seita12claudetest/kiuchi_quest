# [Stream C] UIコンポーネント — ファンタジーRPG風全画面UI

## 概要
ファンタジーRPG風の装飾的UIをCanvas上に描画するコンポーネント群を構築する。
DOM操作は最小限（トップレベルのcanvas要素のみ）、描画は全てCanvas 2D。

## 前提条件
- `src/types/index.ts` の `Rect`, `Scene` 型を参照
- Stream AのGameEngineが提供する `ctx: CanvasRenderingContext2D` を受け取る

## UI参考
- https://interfaceingame.com/ (RPG/Fantasy カテゴリ)
- Game UI Database (ペルソナ, FF, ドラクエ等のメニュー/HUD)

## 作業内容

### 1. テーマ定義 (`src/ui/themes/fantasy.ts`)
```ts
export const THEME = {
  colors: {
    bg: '#0a0f1a',
    panel: 'rgba(26, 31, 46, 0.92)',
    border: '#8b6914',
    borderLight: '#ffd700',
    text: '#e8e8e8',
    textSub: '#a0a0a0',
    accent: '#4ecdc4',
    danger: '#ff4757',
    heal: '#2ed573',
    gold: '#ffd700',
  },
  fonts: { main: '16px "MS Gothic", monospace', title: 'bold 24px "MS Gothic"' },
  panel: { cornerRadius: 8, borderWidth: 3, padding: 12 },
}
```

### 2. Panel (`src/ui/components/Panel.ts`)
- 装飾的ボーダー（ゴールドグラデーション枠）
- 角に装飾（十字/ダイヤ）
- 半透明ダークパネル背景
- `draw(ctx, rect, options?)` API

### 3. HealthBar (`src/ui/components/HealthBar.ts`)
- HPバー（グラデーション: 緑→黄→赤で残量表現）
- EXPバー（青系）
- 必殺ゲージ（金色）
- アニメーション対応（値変化時にスムーズ遷移）

### 4. DialogBox (`src/ui/components/DialogBox.ts`)
- 画面下部メッセージウィンドウ
- テキスト1文字ずつ表示（タイプライター演出）
- 話者名表示（左上タグ）
- 選択肢表示（最大4択）
- ▼送りマーク点滅

### 5. MenuList (`src/ui/components/MenuList.ts`)
- カーソル選択式メニュー
- スクロール対応（項目数>表示数）
- アイコン + テキスト + サブ情報
- 選択時ハイライト（ゴールド枠）

### 6. MiniMap (`src/ui/components/MiniMap.ts`)
- 右上配置の小型マップ
- プレイヤー位置表示（点滅ドット）
- NPC/施設アイコン表示
- 半透明背景

### 7. Toast (`src/ui/components/Toast.ts`)
- 画面上部中央のフェードイン/アウト通知
- アイテム獲得、レベルアップ等
- キューイング（複数通知を順番に表示）

### 8. Transition (`src/ui/components/Transition.ts`)
- フェードイン/アウト
- ワイプ（左→右、上→下）
- シーン切替時に使用
- Promise返却（遷移完了を待てる）

### 9. HUD (`src/ui/components/HUD.ts`)
- マップシーン用常時表示UI
- HP/時間/場所名/ゴールド
- 最小限の情報を装飾枠内に表示

### 10. UIManager (`src/ui/UIManager.ts`)
- 全UIコンポーネントの統括
- レイヤー管理（背景 < HUD < メニュー < ダイアログ < トースト）
- フルスクリーン対応（リサイズ時に再計算）

## TDDテスト
```
tests/ui/Panel.test.ts      - 描画領域計算、padding適用
tests/ui/HealthBar.test.ts  - 値→幅変換、色計算
tests/ui/DialogBox.test.ts  - テキスト進行、選択肢、完了判定
tests/ui/Toast.test.ts      - キュー管理、タイムアウト
tests/ui/Transition.test.ts - 状態遷移（idle→running→done）
```

## 完了条件
- [ ] 全UIコンポーネントがCanvas上に正しく描画される
- [ ] テーマ変更で全体の色/フォントが一括変更可能
- [ ] フルスクリーンリサイズ対応
- [ ] 60FPSで描画負荷が軽い（プロファイラで確認）

## 軽量化ポイント
- UIは dirty flag で差分描画（変更なければ再描画スキップ）
- テキスト描画は measureText キャッシュ
- グラデーションオブジェクトは事前生成・再利用
- Canvas layer分離不要（1 canvas で z-order管理）
