# Rich Game Application Roadmap

木内の大冒険 DELUXE を「複数マップ・複数食料・複数敵・カジノ・ミニゲーム・イベント・病院・家庭・RPG要素・アイテム・Web/Windows配布」に拡張するための実装ロードマップ。

## Phase 0.5: アセットとUI方針

- [ ] `docs/assets.md` に素材ライセンス管理ルールを整備する。
- [ ] `docs/ui-reference.md` に画面別UI方針を整備する。
- [ ] ドット絵食料アイコン候補を選定する。
- [ ] UI、音、エフェクトの取得元を確定する。

## Phase 1: 起動できるゲーム土台

- [ ] `src/main.ts` を追加する。
- [ ] `src/core/GameEngine.ts` を追加する。
- [ ] `src/core/InputManager.ts` を追加する。
- [ ] `src/core/SaveManager.ts` を追加する。
- [ ] `src/scenes/TitleScene.ts` を追加する。
- [ ] `src/scenes/MapScene.ts` を追加する。
- [ ] Canvas上でタイトルからマップへ遷移できるようにする。

## Phase 2: 複数マップと施設

- [ ] `src/maps/MapLoader.ts` を追加する。
- [ ] `src/maps/MapRenderer.ts` を追加する。
- [ ] `src/maps/CollisionSystem.ts` を追加する。
- [ ] `src/maps/Camera.ts` を追加する。
- [ ] 横丁、自宅、病院、カジノ、オフィス、公園、ジム、居酒屋、釣り池、レストラン、裏路地のマップを追加する。

## Phase 3: データ大量追加

- [ ] 敵50種以上を追加する。
- [ ] 食料80種以上を追加する。
- [ ] アイテム80種以上を追加する。
- [ ] 魚30種以上を追加する。
- [ ] NPC15人以上を追加する。
- [ ] スキル30種以上を追加する。
- [ ] クエスト25種以上を追加する。
- [ ] イベント100種以上を追加する。
- [ ] エンディング12種以上を追加する。

## Phase 4: RPGシステム

- [ ] `InventorySystem` を追加する。
- [ ] `SkillSystem` を追加する。
- [ ] `QuestSystem` を追加する。
- [ ] `RelationSystem` を追加する。
- [ ] `TimeSystem` を追加する。
- [ ] `EventEngine` を追加する。
- [ ] `FoodSystem` を追加する。

## Phase 5: シーン実装

- [ ] `BattleScene` を追加する。
- [ ] `EventScene` を追加する。
- [ ] `CasinoScene` を追加する。
- [ ] `FishingScene` を追加する。
- [ ] `MenuScene` を追加する。
- [ ] `ShopScene` を追加する。

## Phase 6: UIリッチ化

- [ ] ファンタジーRPG風テーマを追加する。
- [ ] パネル、ゲージ、会話、メニュー、ミニマップ、トースト、HUDを実装する。
- [ ] 食料ドット絵をインベントリ、ショップ、食事ログに表示する。

## Phase 7: エフェクトと音

- [ ] ParticleSystem を追加する。
- [ ] ScreenShake を追加する。
- [ ] FlashEffect を追加する。
- [ ] TextEffect を追加する。
- [ ] SpriteAnimation を追加する。
- [ ] AudioManager を追加する。
- [ ] BGM/SE定義を追加する。

## Phase 8: 配布

- [ ] GitHub Pages 用のビルド・デプロイを追加する。
- [ ] PWA対応を追加する。
- [ ] Tauri v2 を導入する。
- [ ] Windows向け `.exe` / `.msi` ビルドを追加する。
- [ ] Web版とデスクトップ版でセーブ先を切り替える。

## 開発ルール

- TDDで進める。
- 型は `src/types/index.ts` を優先して使う。
- 外部素材は必ずライセンスと出典を記録する。
- 画像素材はスプライトシート化を優先する。
- Canvas描画はGCを抑え、オブジェクト再利用を意識する。
