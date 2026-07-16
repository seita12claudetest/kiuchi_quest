# 作業分割ガイド — 並列開発用

## ストリーム一覧

| Stream | 内容 | 依存 | 推定規模 |
|--------|------|------|----------|
| A | Core基盤 (GameEngine, Input, Save) | なし（Phase1完了済み部分あり） | 中 |
| B | データ定義 (敵50, NPC15, イベント100, 食80, 魚30) | 型定義のみ | 大 |
| C | UIコンポーネント (Panel, HealthBar, Dialog...) | 型定義のみ | 中 |
| D | マップシステム (10+マップ, タイル描画, 遷移) | 型定義のみ | 中 |
| E | システムロジック (Quest, Inventory, Skill...) | 型定義 + Stream B | 大 |
| F | シーン実装 (Title, Map, Battle, Casino...) | A + C + E | 大 |
| G | エフェクト & 音声 | A (ObjectPool) | 中 |
| H | 配布 (Tauri + Pages) | 全Stream完了後 | 小 |

## 依存関係図

```
Phase 1 (完了) ─┬─→ [A] Core基盤 ──────────→ [F] シーン実装 → [H] 配布
                │                              ↑
                ├─→ [B] データ定義 → [E] Systems ┘
                │                              ↑
                ├─→ [C] UI ────────────────────┘
                │
                ├─→ [D] マップ ─────────────────→ [F]
                │
                └─→ [G] エフェクト/音声 ────────→ [F]
```

## 並列実行可能なグループ

### 同時着手可能（今すぐ）
- **Stream B** (データ定義) — 型定義のみに依存。大量のコンテンツ作成。
- **Stream C** (UI) — 型定義のみに依存。Canvas描画。
- **Stream D** (マップ) — 型定義のみに依存。JSONデータ作成。
- **Stream A** (Core追加) — Phase1基盤の上に構築。
- **Stream G** (エフェクト) — ObjectPool以外は独立。

### A/B/C/D完了後
- **Stream E** (Systems) — データ定義(B)が必要
- **Stream F** (シーン) — A, C, E が必要

### 全完了後
- **Stream H** (配布)

## 各エージェントへの指示テンプレート

```
あなたは「木内の大冒険 DELUXE」のStream [X] を担当します。

リポジトリ: https://github.com/seita12claudetest/kiuchi_quest
ブランチ: feature/stream-[x]-[name] を作成して作業してください。

作業指示: docs/issues/stream-[x]-[name].md を読んでください。
型定義: src/types/index.ts を参照してください。
既存実装: src/core/, src/systems/ を参照してください。

ルール:
1. TDD: まずテストを書き、テストが RED であることを確認してから実装する
2. 型安全: src/types/index.ts の型を必ず使う。独自型を作る場合は整合性を保つ
3. 軽量化: GC負荷を避ける。オブジェクト生成を最小限に。プール再利用推奨
4. テスト: `npx vitest run` で全テストパスを確認してからコミット
5. 1コミット = 1機能単位。小さく頻繁にコミット
6. PR: 完了後 main へPR作成。タイトルに [Stream X] を付ける
```

## 素材リソース
- UI参考: https://interfaceingame.com/
- 音声素材: https://app.cinevva.com/guides/free-sound-effects-music
- スプライト: https://opengameart.org/
- ゲームUIデータベース: Game UI Database (fountn.design)

## 技術メモ
- ビルド確認: SageMaker環境では `npm run build && npx vite preview` で動作確認
- Node.js環境前提。ブラウザ実行はビルド後のみ。
- テストは `npx vitest run` (CI用) または `npx vitest` (watch mode)
