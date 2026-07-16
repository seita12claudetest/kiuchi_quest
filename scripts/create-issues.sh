#!/bin/bash
# GitHub Issues 一括作成スクリプト
# 使い方: git push 後に ./scripts/create-issues.sh を実行

REPO="seita12claudetest/kiuchi_quest"

echo "Creating GitHub Issues for kiuchi_quest..."

# Stream A
gh issue create --repo "$REPO" \
  --title "[Stream A] Core基盤 — GameEngine, シーン管理, メインループ" \
  --label "stream-a,core,phase-1" \
  --body "$(cat docs/issues/stream-a-core.md)"

# Stream B
gh issue create --repo "$REPO" \
  --title "[Stream B] データ定義 — 敵50種, NPC15+, イベント100+, 食べ物80+, 魚30+" \
  --label "stream-b,data,content" \
  --body "$(cat docs/issues/stream-b-data.md)"

# Stream C
gh issue create --repo "$REPO" \
  --title "[Stream C] UIコンポーネント — ファンタジーRPG風全画面UI" \
  --label "stream-c,ui,frontend" \
  --body "$(cat docs/issues/stream-c-ui.md)"

# Stream D
gh issue create --repo "$REPO" \
  --title "[Stream D] マップシステム — 10+マップ, タイル描画, 遷移" \
  --label "stream-d,maps" \
  --body "$(cat docs/issues/stream-d-maps.md)"

# Stream E
gh issue create --repo "$REPO" \
  --title "[Stream E] ゲームシステム — Quest, Inventory, Skill, Relation, Time, Event" \
  --label "stream-e,systems,logic" \
  --body "$(cat docs/issues/stream-e-systems.md)"

# Stream F
gh issue create --repo "$REPO" \
  --title "[Stream F] シーン実装 — Title, Map, Battle, Casino, Fishing, Menu" \
  --label "stream-f,scenes" \
  --body "$(cat docs/issues/stream-f-scenes.md)"

# Stream G
gh issue create --repo "$REPO" \
  --title "[Stream G] エフェクト & 音声 — パーティクル, BGM/SE" \
  --label "stream-g,effects,audio" \
  --body "$(cat docs/issues/stream-g-effects-audio.md)"

# Stream H
gh issue create --repo "$REPO" \
  --title "[Stream H] 配布 — Tauri (.exe) + GitHub Pages + PWA" \
  --label "stream-h,distribution,deploy" \
  --body "$(cat docs/issues/stream-h-distribution.md)"

echo "Done! All issues created."
