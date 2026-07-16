# [Stream A] Core基盤 — GameEngine, シーン管理, メインループ

## 概要
ゲーム全体を駆動するメインループ、シーン切り替え、入力処理の基盤を構築する。

## 前提条件
- `src/types/index.ts` の型定義を参照すること
- `src/core/EventBus.ts`, `src/core/StateMachine.ts` は実装済み

## 作業内容

### 1. GameEngine (`src/core/GameEngine.ts`)
- `requestAnimationFrame` ベースの60FPSメインループ
- delta time計算（固定タイムステップ推奨: 16.67ms）
- Scene管理: `pushScene()`, `popScene()`, `replaceScene()`
- グローバル `GameState` の保持
- パフォーマンス: フレームスキップ対応、GC負荷軽減のためオブジェクトプール活用

### 2. InputManager (`src/core/InputManager.ts`)
- キーボードイベント管理 (keydown/keyup)
- キー状態マップ (isPressed, justPressed, justReleased)
- フレーム同期（入力はupdate内でのみ消費）

### 3. SaveManager (`src/core/SaveManager.ts`)
- localStorage ベースのセーブ/ロード
- スロット3つ + オートセーブ
- `SaveData` 型準拠
- バージョンマイグレーション対応

### 4. ObjectPool (`src/utils/ObjectPool.ts`)
- ジェネリックなオブジェクトプール
- パーティクル、ダメージ数字等で利用
- `acquire()` / `release()` API

## TDDテスト（先に書く）
```
tests/core/GameEngine.test.ts   - シーン遷移、update呼び出し順序
tests/core/InputManager.test.ts - キー状態管理
tests/core/SaveManager.test.ts  - セーブ/ロード/マイグレーション
tests/utils/ObjectPool.test.ts  - acquire/releaseサイクル
```

## 完了条件
- [ ] 全テストパス
- [ ] GameEngineがcanvasにフレーム描画できる
- [ ] シーン切替が正常動作
- [ ] セーブ/ロードが動作

## 軽量化ポイント
- requestAnimationFrame一本。setInterval不使用
- update/renderの分離（ロジックは固定60Hz、描画はVSync依存）
- 入力バッファは配列ではなくビットフラグ

## 参考
- 型定義: `src/types/index.ts` の `Scene`, `GameState`, `SaveData`
- 既存実装: `src/core/EventBus.ts`, `src/core/StateMachine.ts`
