# 木内の大冒険 DELUXE

## プロジェクト概要
歓楽横丁 × 健康管理 × 会社員RPG。全画面ファンタジーRPG風UI。

## 技術スタック
- TypeScript + Vite + Vitest
- Canvas 2D 描画（DOM操作最小限）
- 配布: Tauri (.exe) + GitHub Pages

## コマンド
- `npm run dev` — 開発サーバー
- `npm run build` — プロダクションビルド
- `npm run preview` — ビルド後プレビュー（SageMaker環境ではこれで確認）
- `npm test` — テスト (watch mode)
- `npm run test:run` — テスト (CI用、1回実行)

## アーキテクチャ
- `src/types/index.ts` — 全ストリーム共有の型定義（契約）
- `src/core/` — GameEngine, EventBus, StateMachine, Input, Save
- `src/systems/` — ステートレスなゲームロジック
- `src/scenes/` — 各画面（Scene インターフェース準拠）
- `src/ui/` — Canvas UIコンポーネント
- `src/maps/` — マップデータ + ローダー
- `src/data/` — ゲームデータ定義
- `src/effects/` — 視覚エフェクト
- `src/audio/` — 音声管理
- `tests/` — Vitest テスト

## 開発ルール
1. TDD: テスト先行。RED → GREEN → REFACTOR
2. 型安全: `src/types/index.ts` の型を必ず使う
3. 軽量化: GC回避、オブジェクトプール、dirty flag差分描画
4. テスト通過確認してからコミット: `npx vitest run`
5. 1コミット = 1機能単位

## 進捗ログ

- `docs/agent-log.md` にCodex/Claude Code双方の進捗・問題・アイデアを記録する。作業開始前に直近のエントリを読み、作業後(特にPRマージ後)は新しいエントリを先頭に追加する。

## 並列開発
- `docs/issues/` に各ストリームの作業指示書あり
- `docs/issues/README.md` に依存関係と並列実行計画
- ブランチ命名: `feature/stream-[x]-[name]`

## 素材ソース
- UI: https://interfaceingame.com/
- 音声: Cinevva free sounds (CC0)
- スプライト: OpenGameArt.org (CC0/CC-BY)
