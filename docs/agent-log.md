# エージェント進捗ログ

CodexとClaude Codeがこのリポジトリで作業した内容・問題・アイデアを共有するための記録。
新しいセッションの前に、直近のエントリを読んでから作業を始めること。新しい記録は先頭に追加する。

## 2026-07-19 — Claude Code: GitHub PagesをGodot Webビルドへ切り替え (PR #22)

**進捗**
- `.github/workflows/deploy.yml` が、Godotへの移行後もPR #20/#21のマージ後に旧Vite/TS版(`npm run build`)をビルド・公開し続けていたことが判明(気づかず2回分デプロイしていた)。`firebelley/godot-export@v8.0.0` でGodot 4.7.1-stable(ローカルエディタと同一バージョン、GitHub公式リリースのLinuxヘッドレス版+エクスポートテンプレートを使用)のWebビルドをエクスポートし、GitHub Pagesへ配信するよう置き換えた。
- `godot/export_presets.cfg` を新規追加。Webプリセットで `variant/thread_support=false` を明示し、`web_nothreads_*` テンプレートを使用。GitHub PagesはCOOP/COEPヘッダーを返さずSharedArrayBufferが使えないため、Thread対応版だと動作しない制約を回避した(coi-serviceworkerのような追加ワークアラウンドは不要)。
- `pull_request` トリガーを追加し、buildジョブ(エクスポートのみ)はマージ前のPRでもCIで検証できるようにした。deployジョブは`push`/`workflow_dispatch`のみに限定。
- マージ後、実際に https://seita12claudetest.github.io/kiuchi_quest/ の配信内容がGodotのHTML5シェル(`<title>木内の大冒険 DELUXE</title>` と `#canvas`)に切り替わったことを`curl`で確認済み。

**問題**
- 気づいた時点で、Godotへの移行(PR #20, 2026-07-19T12:28マージ)後もGitHub Pagesは古いプロトタイプを表示し続けていた。デプロイ先の切り替えを忘れると「マージしたのに公開サイトに反映されない」状態になるので、Godot関連のPRを今後マージする際はこの点に注意する。
- ローカル環境にはGodotのWebエクスポートテンプレートが未導入のため、ローカルでの完全な `--export-release` 検証はできない(「テンプレート未導入」エラーまでは確認できるが、実際のビルド成功はCI頼み)。今回はPRの`pull_request`トリガーで実際にCI上のエクスポートを検証してからマージした。

**次のアイデア / 未着手 (Issue #1 Phase 2 ほか)**
- [ ] 田中と同じ好感度分岐パターンを佐藤・山川・その他NPCへ横展開する。
- [ ] 好感度・関係を可視化するUI(人物録)。
- [ ] 状態異常、装備、パッシブスキル(battle_controller.gd の拡張)。
- [ ] 曜日・時間限定イベント。
- [ ] 敵・アイテム・クエストの追加。
- [ ] 残り3店舗(たぬき・まつ・夜汽車)の背景画像生成 → Codexでの対応を想定(Claude Code環境には画像生成ツールがない)。
- [ ] 音響(BGM/SE)の実装。
- [ ] PWA対応(`progressive_web_app/enabled`は現状false)。

## 2026-07-19 — Claude Code: 田中の会話を好感度で分岐 (PR #21)

**進捗**
- `GameState.dialogue_text()` を追加。`dialogue_tiers` を持つ相互作用は `relationships[NPC]` の値で台詞が変わる。
- `office_inside` の田中との会話を一度きりイベントから繰り返し可能な好感度上昇イベントに変更(効果を `trust+1` から `relationships.tanaka+1` へ)。好感度6到達で `tanaka_close_friend` フラグと専用セリフを解放。
- `godot/tests/validate_dialogue_tiers.gd` を追加し、tier選択とフラグ解放をヘッドレス検証。
- Issue #1 Phase 2「NPCごとの会話・好感度分岐」の最初の1体分(田中)を実装。パターンは他NPCへ横展開できる形にした。

**問題**
- PR #20(Godot縦切り基盤)は実際にはマージ済みだったが、Codexが利用制限でマージ後の再確認ができておらず、ユーザーへの報告に不安要素が残っていた → `gh pr view` で `MERGED` を確認し解消。ローカル`main`も1コミット分古かったため `git pull` で追従。
- Claude Code側の実行環境には画像生成ツールがない。昭和横丁の残り3店舗(たぬき・まつ・夜汽車)の背景画像はCodexの内蔵画像生成でないと作れない。

**次のアイデア / 未着手 (Issue #1 Phase 2)**
- [ ] 田中と同じ好感度分岐パターンを佐藤・山川・その他NPCへ横展開する。
- [ ] 好感度・関係を可視化するUI(人物録)。
- [ ] 状態異常、装備、パッシブスキル(battle_controller.gd の拡張)。
- [ ] 曜日・時間限定イベント。
- [ ] 敵・アイテム・クエストの追加。
- [ ] 残り3店舗(たぬき・まつ・夜汽車)の背景画像生成 → Codexでの対応を想定。
- [ ] Web export テンプレート整備とGitHub Pages公開(PR #20の「現在の到達点」で先送りされた項目)。
- [ ] 音響(BGM/SE)の実装。
