# エージェント進捗ログ

CodexとClaude Codeがこのリポジトリで作業した内容・問題・アイデアを共有するための記録。
新しいセッションの前に、直近のエントリを読んでから作業を始めること。新しい記録は先頭に追加する。

## 2026-07-19 — Claude Code: 移動キー修正・日本語フォント同梱・戦闘に疲労/パッシブ追加 (PR #24, #25)

**進捗**
- ユーザーが実際にデプロイ後のGitHub Pagesをプレイし、(1)矢印キーで左右に移動できない (2)日本語が全て文字化けする、の2件を発見。
- `godot/project.godot` の `move_left`/`move_right` の矢印キーの物理キーコードが誤っていた(`4194311`=Insert, `4194313`=Pause → 正しくは `4194319`=Left, `4194321`=Right)。`move_up`/`move_down`の矢印キー(`4194320`/`4194322`=Up/Down)は元から正しく、WASD側も正しかったため、上下だけ動けて左右が動けない状態になっていた。(PR #24)
- Godotのデフォルトフォントは日本語グリフを持たず、デスクトップ版はOSフォントフォールバックで偶然表示できていただけで、フォールバックの効かないWeb版は常に文字化けしていた。Noto Sans JP(SIL OFL、Google Fonts経由でGoogle公式リポジトリから取得、`godot/assets/fonts/`)をプロジェクトのデフォルトフォント(`gui/theme/custom_font`)として同梱して解決。(PR #24)
- 戦闘に状態異常「疲労」(敵の重い攻撃で発生し、次の分析系行動の威力-6)とパッシブスキル「経理の勘どころ」(専門性15以上で「整理する」+3)を追加。Issue #1 Phase 2「状態異常、装備、パッシブスキル」の第一弾。(PR #25)
- ダメージ計算を `battle_controller.gd` から依存なしの `battle_math.gd`(静的関数)へ切り出し。`godot/tests/validate_battle_resolve.gd` でヘッドレス検証できるようにした。

**問題 / 気づき**
- 前回(PR #22)はGitHub Pagesが実際にGodotのHTML5シェルを返すことを`curl`で確認しただけで、ブラウザで実際に操作して見た目・操作性を確認していなかった。今回は必ずCIのビルド成果物(`web-build-preview`アーティファクト)をダウンロードし、ローカルで配信してブラウザ(Claude Codeのbrowser pane)で実際にプレイして検証してからマージした。**デプロイ確認は「レスポンスが返る」だけでなく実際に触って確認すること。**
- `battle_controller.gd` は `GameState` (autoload) を直接参照しているため、ヘッドレステストからこのファイルを `preload` するとクラス全体のコンパイルが失敗し、テストが正常終了せずハングするような挙動になった。GameStateなど autoload に依存する既存スクリプトの一部だけをテストしたい場合は、依存のない純粋関数として別ファイルに切り出す必要がある(`validate_dialogue_tiers.gd` が `game_state.gd` を直接preloadできていたのは、そのファイル自体が外部の `GameState` という識別子を参照していないため)。
- Claude Codeのbrowser paneでの `key` アクション(CDP経由の合成キーイベント)は、1回だけ・数回だけの送信では移動やインタラクトが画面に反映されないことがある(即座のkeydown+keyupで、Godotの物理フレーム処理に間に合わない可能性)。多めに(20〜40回程度)送り、送信後に`wait`を挟んでからスクリーンショットを取ることで、実際の移動・シーン遷移が確認できた。

**次のアイデア / 未着手 (Issue #1 Phase 2 ほか)**
- [ ] 田中と同じ好感度分岐パターンを佐藤・山川・その他NPCへ横展開する。
- [ ] 好感度・関係を可視化するUI(人物録)。
- [ ] 状態異常・パッシブの追加種類(装備システムはまだ未着手)。
- [ ] 曜日・時間限定イベント。
- [ ] 敵・アイテム・クエストの追加。
- [ ] 残り3店舗(たぬき・まつ・夜汽車)の背景画像生成 → Codexでの対応を想定(Claude Code環境には画像生成ツールがない)。
- [ ] 音響(BGM/SE)の実装。
- [ ] PWA対応(`progressive_web_app/enabled`は現状false)。

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
