# [Stream D] マップシステム — 10+マップ, タイル描画, 遷移

## 概要
タイルベースのマップ描画・読み込み・遷移システムを構築する。
マップデータはJSON形式。描画は最小限のタイルのみ（画面内のみ描画）。

## 前提条件
- `src/types/index.ts` の `MapDef`, `WarpPoint`, `MapNPC` 型を参照

## 作業内容

### 1. MapLoader (`src/maps/MapLoader.ts`)
- JSONマップデータの読み込み（dynamic import で遅延ロード）
- マップキャッシュ（一度読んだマップはメモリ保持）
- `loadMap(id: string): Promise<MapDef>`

### 2. MapRenderer (`src/maps/MapRenderer.ts`)
- タイルベース描画（40x40px）
- カメラ（ビューポート）: プレイヤー中心追従
- 画面外タイルは描画スキップ
- タイルセット: 番号→色/パターンのマッピング
- レイヤー: 地面 → オブジェクト → NPC → プレイヤー
- 時間帯による色調変化（朝:暖色, 夜:暗色オーバーレイ）

### 3. マップデータ (`src/maps/data/`)
各マップ JSON:
```json
{
  "id": "yokocho",
  "name": "歓楽横丁",
  "width": 24, "height": 18,
  "tiles": [[...]],
  "collisions": [[...]],
  "npcs": [{"id":"shopkeeper","x":5,"y":3,"sprite":{...}}],
  "warps": [{"x":23,"y":9,"targetMap":"izakaya","targetX":1,"targetY":5}],
  "encounterRate": 0.35,
  "enemyPool": ["e1","e2","e3"],
  "bgm": "yokocho_theme"
}
```

#### マップ一覧 (10+)
1. `yokocho.json` — 横丁メインストリート (24x18)
2. `izakaya.json` — 居酒屋内部 (16x12)
3. `office.json` — オフィスフロア (20x15)
4. `hospital.json` — 病院内部 (18x14)
5. `casino.json` — カジノフロア (22x16)
6. `park.json` — 公園 (20x20) ※釣り場あり
7. `gym.json` — ジム内部 (14x10)
8. `home.json` — 自宅 (10x8)
9. `fishing_pond.json` — 釣り池 (16x14)
10. `restaurant.json` — レストラン (14x12)
11. `secret_alley.json` — 裏路地 (12x20) ※隠しエリア

### 4. CollisionSystem (`src/maps/CollisionSystem.ts`)
- タイル衝突判定
- NPC衝突判定
- ワープポイント検出

### 5. Camera (`src/maps/Camera.ts`)
- プレイヤー追従（スムーズ補間）
- マップ端クランプ
- `worldToScreen()`, `screenToWorld()` 変換

## TDDテスト
```
tests/maps/MapLoader.test.ts      - 読み込み、キャッシュ、不正データ
tests/maps/CollisionSystem.test.ts - 壁判定、NPC判定、ワープ検出
tests/maps/Camera.test.ts          - 追従、クランプ、座標変換
```

## 完了条件
- [ ] 全10+マップのJSONデータ作成完了
- [ ] マップ間遷移が正常動作
- [ ] カメラ追従がスムーズ
- [ ] 画面外描画スキップでパフォーマンス維持

## 軽量化ポイント
- 可視タイルのみ描画（カリング）
- タイル描画は pre-rendered tile cache (OffscreenCanvas)
- マップデータは dynamic import で必要時のみロード
- NPCスプライトはアトラスから切り出し（個別画像ロードなし）
