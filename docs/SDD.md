# 木内の大冒険 DELUXE - Software Design Document (SDD)

## 1. プロジェクト概要

歓楽横丁 × 健康管理 × 会社員RPGをテーマとした全画面RPGゲーム。
ファンタジーRPG風の装飾的UIを採用し、リッチな演出・複数マップ・大量のイベント/キャラクターで構成する。

## 2. 技術スタック

| 区分 | 技術 |
|------|------|
| 言語 | TypeScript |
| バンドラー | Vite |
| テスト | Vitest |
| 描画 | Canvas 2D + CSS アニメーション |
| 音声 | Web Audio API |
| デスクトップ配布 | Electron (electron-builder) |
| Web配布 | GitHub Pages (vite build → static) |
| 状態管理 | 自作EventEmitter + Immutable State |
| アセット | スプライトシート (PNG) + JSON定義 |

## 3. アーキテクチャ

```
src/
├── main.ts                 # エントリポイント
├── core/
│   ├── GameEngine.ts       # メインループ, シーン管理
│   ├── EventBus.ts         # グローバルイベントシステム
│   ├── StateMachine.ts     # ゲーム状態遷移
│   └── SaveManager.ts      # セーブ/ロード (localStorage + File)
├── scenes/
│   ├── TitleScene.ts       # タイトル画面
│   ├── MapScene.ts         # マップ探索
│   ├── BattleScene.ts      # バトル
│   ├── EventScene.ts       # イベント/会話
│   ├── CasinoScene.ts      # カジノ/遊技場
│   ├── ShopScene.ts        # ショップ
│   └── MenuScene.ts        # メニュー（装備/スキル/図鑑等）
├── entities/
│   ├── Player.ts           # プレイヤー
│   ├── Enemy.ts            # 敵キャラ
│   ├── NPC.ts              # NPC
│   └── EntityFactory.ts    # ファクトリ
├── systems/
│   ├── BattleSystem.ts     # バトルロジック
│   ├── HealthSystem.ts     # 健康管理ロジック
│   ├── QuestSystem.ts      # クエスト進行
│   ├── RelationSystem.ts   # 好感度
│   ├── InventorySystem.ts  # インベントリ/装備
│   ├── SkillSystem.ts      # スキルツリー
│   ├── TimeSystem.ts       # 時間/曜日管理
│   └── CasinoSystem.ts     # カジノゲームロジック
├── ui/
│   ├── UIManager.ts        # UI描画統括
│   ├── components/
│   │   ├── Panel.ts        # 装飾パネル（ファンタジーRPG風フレーム）
│   │   ├── HealthBar.ts    # HP/ステータスバー
│   │   ├── DialogBox.ts    # 会話ウィンドウ
│   │   ├── MenuList.ts     # メニューリスト
│   │   ├── MiniMap.ts      # ミニマップ
│   │   ├── Toast.ts        # 通知トースト
│   │   └── Transition.ts   # 画面遷移エフェクト
│   └── themes/
│       └── fantasy.ts      # テーマ定数（色/フォント/装飾）
├── maps/
│   ├── MapLoader.ts        # マップ読み込み
│   ├── MapRenderer.ts      # マップ描画
│   └── data/               # マップJSONデータ
│       ├── yokocho.json    # 横丁メインストリート
│       ├── izakaya.json    # 居酒屋内部
│       ├── office.json     # オフィス
│       ├── hospital.json   # 病院内部
│       ├── casino.json     # カジノフロア
│       ├── park.json       # 公園
│       ├── gym.json        # ジム内部
│       └── home.json       # 自宅
├── data/
│   ├── enemies.ts          # 敵50種定義
│   ├── npcs.ts             # NPC定義
│   ├── items.ts            # アイテム定義
│   ├── skills.ts           # スキル定義
│   ├── quests.ts           # クエスト定義
│   ├── events.ts           # イベント100+定義
│   ├── endings.ts          # エンディング条件
│   └── casino-games.ts     # カジノゲーム定義
├── effects/
│   ├── ParticleSystem.ts   # パーティクル
│   ├── ScreenShake.ts      # 画面揺れ
│   ├── FlashEffect.ts      # フラッシュ
│   └── TextEffect.ts       # ダメージ数字飛び等
├── audio/
│   ├── AudioManager.ts     # BGM/SE管理
│   └── sounds.ts           # サウンド定義
└── utils/
    ├── math.ts             # ユーティリティ
    ├── random.ts           # 乱数
    └── constants.ts        # 定数

tests/
├── systems/
│   ├── BattleSystem.test.ts
│   ├── HealthSystem.test.ts
│   ├── QuestSystem.test.ts
│   ├── InventorySystem.test.ts
│   ├── SkillSystem.test.ts
│   └── CasinoSystem.test.ts
├── entities/
│   ├── Player.test.ts
│   └── Enemy.test.ts
├── core/
│   ├── StateMachine.test.ts
│   └── SaveManager.test.ts
└── ui/
    └── components/
```

## 4. ゲームシステム設計

### 4.1 マップシステム
- タイルベース（40x40px基本）
- 8エリア以上：横丁, 居酒屋, オフィス, 病院, カジノ, 公園, ジム, 自宅
- マップ間遷移ポイント（階段/ドアアイコン）
- 各マップにNPC配置、ランダムエンカウント率設定

### 4.2 バトルシステム
- コマンドバトル（たたかう/にげる/スキル/アイテム/太る/必殺技）
- スキルシステム：レベルアップ時にSP獲得 → スキルツリーで取得
- 敵50種：横丁系/オフィス系/健康系/ボス系に分類
- ボス戦：専用BGM、カットイン演出
- バトル中のアニメーション（攻撃エフェクト、ダメージ表示）

### 4.3 健康管理システム
- 指標：血圧, 尿酸値, コレステロール, 腹囲係数, 肝機能, 血糖値
- 飲み会参加 → 各指標悪化
- ジム/病院/食事管理 → 改善
- 閾値超過でデバフ/強制イベント発生
- 健康診断イベント（年1回、結果でエンディング分岐）

### 4.4 カジノ/遊技場
- スロット（3リール）
- ブラックジャック
- ポーカー（簡易版）
- ルーレット
- コイン制（ゴールドと交換）
- 景品交換所（レアアイテム入手）

### 4.5 釣りシステム
- 釣り場マップ（公園の池、川釣りエリア）
- 釣りミニゲーム（タイミングゲージ + 引きバトル）
- 魚30種以上（レア度5段階）
- 釣った魚 → 料理素材 or 売却
- 魚図鑑（コンプリート報酬あり）
- 曜日/時間帯で出現する魚が変化

### 4.6 食事/料理システム
- 食べ物80種以上（居酒屋メニュー、コンビニ、自炊、釣り料理）
- 食べ物カテゴリ：おつまみ/主食/デザート/ドリンク/健康食/ジャンクフード
- 各食べ物に絵文字アイコン + Canvas描画のリッチな食べ物画像
- 食べ物効果：HP回復/ステータスバフ/健康指標変動
- 料理レシピ（素材組み合わせ）
- 食事ログ（カロリー/栄養バランス表示）
- グルメ図鑑（食べた物を記録）
- 食べ物画像：カテゴリごとにスプライトシート化し、メニュー/取得時に表示

### 4.7 イベントシステム
- 100+イベント：ストーリー系/ランダム系/曜日系/好感度系/季節系
- フラグ管理による分岐
- 会話選択肢（最大4択）
- イベントCG表示（キャラ立ち絵）

### 4.8 装備システム
- 部位：武器/防具/アクセサリ×2
- 装備による能力変動
- レア装備はカジノ/ボスドロップ/クエスト報酬

### 4.9 スキルツリー
- 3系統：肉体派/社交派/節制派
- 各系統10スキル程度
- SP（スキルポイント）で習得

### 4.10 好感度/関係値
- NPC8人以上（店主, 医師, トレーナー, 同僚, 上司, 後輩, バーテンダー, 謎の老人）
- 好感度イベント（段階的に解放）
- MAXで専用エンディング

### 4.11 時間/曜日システム
- 1日4ターン（朝/昼/夕方/夜）
- 曜日ごとの特殊イベント
- 季節変化（30日=1ヶ月, 4ヶ月で1年）
- 年末イベント（忘年会ボス）

## 5. UI設計方針

### 5.1 全画面レイアウト
```
┌──────────────────────────────────────────────┐
│ [装飾ヘッダー: ゲームタイトル + 時間表示]     │
├──────────────────────────────────────────────┤
│                                              │
│         ┌─────────────────────┐              │
│         │                     │  ┌─────────┐ │
│         │    メインキャンバス    │  │サイドパネル│ │
│         │    (マップ/バトル)    │  │(ステータス)│ │
│         │                     │  │         │ │
│         └─────────────────────┘  └─────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ [メッセージウィンドウ / コマンド]          │ │
│ └──────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│ [ミニマップ] [クイックアクセスボタン]         │
└──────────────────────────────────────────────┘
```

### 5.2 ファンタジーRPG風デザイン要素
- 装飾的ボーダー（金色の縁取り、角装飾）
- 半透明ダークパネル + テクスチャ背景
- アイコンベースのメニュー
- テキストにグロウエフェクト
- 画面遷移：フェードイン/アウト、ワイプ
- バトル：カットイン演出、パーティクル

### 5.3 カラーパレット
- 背景: #0a0f1a (深い紺)
- パネル: #1a1f2e (ダークブルー) + 半透明
- アクセント: #ffd700 (ゴールド), #4ecdc4 (ティール)
- テキスト: #e8e8e8 (ライト), #a0a0a0 (サブ)
- 危険: #ff4757, 回復: #2ed573
- 装飾枠: #8b6914 → #ffd700 グラデーション

## 6. 開発フェーズ

### Phase 1: 基盤構築 (Core Infrastructure)
- Vite + TypeScript + Vitest セットアップ
- GameEngine (メインループ, シーン管理)
- EventBus, StateMachine
- 基本UI コンポーネント (Panel, HealthBar, DialogBox)
- テーマシステム
- **テスト**: StateMachine, EventBus の単体テスト

### Phase 2: マップ & 移動
- MapLoader, MapRenderer
- タイル描画、マップデータ構造
- プレイヤー移動 (キーボード操作)
- マップ遷移 (エリア間移動)
- ミニマップ
- **テスト**: MapLoader, 移動ロジック

### Phase 3: バトルシステム
- BattleSystem コア
- 敵データ (50種定義)
- コマンド処理
- バトルアニメーション/エフェクト
- 経験値/レベルアップ
- **テスト**: BattleSystem (ダメージ計算, レベルアップ)

### Phase 4: 健康管理 & NPC
- HealthSystem
- 健康指標の変動ロジック
- NPC配置/会話
- 好感度システム
- 施設イベント (病院/ジム/ショップ)
- **テスト**: HealthSystem, RelationSystem

### Phase 5: イベント & クエスト
- QuestSystem
- イベントエンジン (フラグ/分岐)
- 100+イベント実装
- 曜日/季節イベント
- エンディング条件
- **テスト**: QuestSystem, イベントフラグ

### Phase 6: 装備/スキル/インベントリ
- InventorySystem
- SkillSystem + スキルツリーUI
- 装備画面
- ショップ拡張
- **テスト**: InventorySystem, SkillSystem

### Phase 7: カジノ/遊技場
- CasinoSystem
- スロット/ブラックジャック/ポーカー/ルーレット
- コイン/景品システム
- カジノ専用UI
- **テスト**: 各ゲームロジック (期待値/確率)

### Phase 7.5: 釣り & 食事システム
- FishingSystem (タイミングゲージ + 魚図鑑)
- 釣りミニゲームUI/演出
- FoodSystem (食べ物80種, 効果, レシピ)
- 食べ物画像スプライト (Canvas描画 or 絵文字ベース + 装飾)
- グルメ図鑑UI
- **テスト**: FishingSystem, FoodSystem (効果計算, レシピ組合せ)

### Phase 8: 演出/音声/仕上げ
- ParticleSystem, ScreenShake等
- BGM/SE実装
- 画面遷移エフェクト
- バトルカットイン
- タイトル画面演出
- パフォーマンス最適化

### Phase 9: 配布準備
- Electron パッケージ (.exe)
- GitHub Pages デプロイ設定
- セーブデータ互換性
- README / 操作説明

## 7. データ量見積もり

| カテゴリ | 数量 |
|----------|------|
| マップ | 10+ |
| 敵種類 | 50 |
| NPC | 15+ |
| アイテム | 80+ |
| 食べ物 | 80+ |
| 魚 | 30+ |
| スキル | 30 |
| クエスト | 25+ |
| イベント | 100+ |
| エンディング | 12+ |
| カジノゲーム | 4 |
| 料理レシピ | 20+ |
| BGM/SE | 20+ |

## 8. 配布形態

### Web版 (GitHub Pages)
- `vite build` → dist/ を GitHub Pages にデプロイ
- PWA対応でオフライン利用可
- セーブデータは localStorage

### デスクトップ版 (.exe)
- Electron でラップ
- `electron-builder` で Windows .exe 生成
- セーブデータはローカルファイル (JSON)
- 起動時に全画面化オプション
