# Asset Acquisition Plan

木内の大冒険 DELUXE で利用する外部素材の取得・記録・実装ルールを定義する。
食料画像はドット絵RPG風を優先し、SVGはUI記号や状態異常アイコンなどに限定して使う。

## 採用優先度

1. CC0 / Public Domain
2. 商用利用可・クレジット任意
3. CC-BY などクレジット表記で利用可能な素材
4. 上記以外は原則採用しない

## 禁止・要注意素材

- 商用利用不可の素材
- 改変禁止の素材
- ライセンス条件が曖昧な素材
- 既存ゲームのスクリーンショットから切り抜いた素材
- ファンアート、版権キャラクター、既存ゲーム由来のUI画像
- AI生成素材で権利・利用条件が確認できないもの

## 推奨ディレクトリ

```txt
public/
  assets/
    icons/
      food/
        food-atlas.png
        food-atlas.json
      items/
        item-atlas.png
        item-atlas.json
      ui/
        ui-icons.svg
    audio/
      bgm/
      se/
    effects/
src/
  assets/
    IconAtlas.ts
  data/
    assetCredits.ts
```

## 食料アイコン方針

- 基本サイズは 16x16 または 32x32。
- Canvas表示ではスプライトシート化して読み込み回数を減らす。
- `FoodDef.icon` には絵文字フォールバックを入れる。
- `FoodDef.spritePos` にはスプライトシート上の座標を入れる。
- 画像未ロード時や未設定データでは `icon` の絵文字を表示する。

## 食料アイコン候補

| 優先 | 候補 | 用途 | ライセンス確認 | URL |
|---|---|---|---|---|
| 1 | OpenGameArt CC0 Food Icons | メイン食料アイコン | CC0表記を確認してから採用 | https://opengameart.org/content/cc0-food-icons |
| 2 | OpenGameArt 16x16 Food | インベントリ小アイコン | CC0表記を確認してから採用 | https://opengameart.org/content/16x16-food |
| 3 | itch.io Free Pixel Foods | 食料バリエーション追加 | 各ページの利用条件を確認 | https://ghostpixxells.itch.io/pixelfood |
| 4 | OpenGameArt RPG Icon Pack | 装備・薬・素材 | 素材ページごとに確認 | https://opengameart.org/content/496-pixel-art-icons-for-medievalfantasy-rpg |
| 5 | Game-icons.net | SVG状態アイコン | ライセンス表記を確認 | https://game-icons.net/ |

## UI・ボタン素材候補

| 候補 | 用途 | 注意 |
|---|---|---|
| Kenney UI Pack | ボタン、パネル、ゲージ | ライセンスを素材ページで確認する |
| Game-icons.net | HP、毒、回復、攻撃、防御、状態異常 | SVGのライセンス・クレジット要否を確認する |
| 自作Canvas UI | 装飾枠、HUD、会話ウィンドウ | 権利リスクが少ないため優先 |

## 効果音・BGM候補

| 候補 | 用途 | 注意 |
|---|---|---|
| Kenney Audio | UI音、コイン、アイテム取得、攻撃音 | ライセンス確認後に採用 |
| Pixabay Sound Effects | 環境音、通知音、生活音 | 素材ごとに条件を確認する |
| Pixabay Music | BGM | 素材ごとに条件を確認する |
| OpenGameArt | 魔法、攻撃、爆発、パーティクル | ライセンス混在のため個別確認必須 |
| itch.io Free Assets | ドット絵エフェクト、追加UI | ライセンス混在のため個別確認必須 |

## クレジット記録フォーマット

素材を追加したら、必ずこの形式で `docs/assets.md` または `src/data/assetCredits.ts` に記録する。

```md
### 素材名
- Source: URL
- Author: 作者名または配布者名
- License: CC0 / CC-BY 4.0 / 独自ライセンスなど
- Used for: 食料アイコン / UI音 / BGM など
- Local files: public/assets/...
- Notes: クレジット要否、改変内容、取得日
```

## 実装タスク

- [ ] `public/assets/icons/food/` を作成する。
- [ ] 食料アイコン候補を1セット選定する。
- [ ] ライセンスと出典をこの文書に記録する。
- [ ] `food-atlas.png` と `food-atlas.json` を配置する。
- [ ] `src/assets/IconAtlas.ts` を追加する。
- [ ] `src/data/foods.ts` の各データに `spritePos` を割り当てる。
- [ ] アイコン未設定時は絵文字フォールバック表示する。
- [ ] `tests/data/foods.test.ts` で全食料データの `icon` または `spritePos` を検証する。
