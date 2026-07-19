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

## 採用済み素材（2026-07-19）

### Kenney Digital Audio
- Source: https://kenney.nl/assets/digital-audio
- Author: Kenney
- License: CC0 1.0（公式素材ページおよび同梱 `License.txt` で確認）
- Used for: UI選択、決定、キャンセル、昇進の効果音
- Local files: `public/assets/audio/ui/*.ogg`
- License copy: `public/assets/licenses/kenney-digital-audio-license.txt`
- Notes: 公式ZIPから4音だけを選定。改名以外の加工なし。商用利用可、クレジット不要。

### 木内キャラクター歩行スプライト
- Source: OpenAI image generation（プロジェクト専用のオリジナル生成物）
- Author: Generated for kiuchi_quest
- License: プロジェクト専用生成素材。第三者ゲーム素材の模倣を禁止したプロンプトで制作。
- Used for: 主人公の4方向歩行表示
- Local files: `public/assets/characters/kiuchi-walk.png`
- Notes: 4列×3行。クロマキー除去済み。生成日 2026-07-19。

### 歓楽横丁マップ背景
- Source: OpenAI image generation（プロジェクト専用のオリジナル生成物）
- Author: Generated for kiuchi_quest
- License: プロジェクト専用生成素材
- Used for: `yokocho` マップ背景
- Local files: `public/assets/maps/yokocho-night.png`
- Notes: 人物なしの歩行用背景。生成日 2026-07-19。今後、明確なCC0タイルセットで品質が上がる場合は差し替え可能。

### 1988年会社マップ背景
- Source: OpenAI image generation（プロジェクト専用のオリジナル生成物）
- Author: Generated for kiuchi_quest
- License: プロジェクト専用生成素材
- Used for: `office` マップ背景、朝〜夕方の勤務パート
- Local files: `public/assets/maps/office-1988.png`
- Notes: 人物・実在企業ロゴなし。AS/400時代を想起させる汎用端末、紙、FAX、会議室を配置。生成日 2026-07-19。

### 日本食アイコンアトラス
- Source: OpenAI image generation（既存無料素材の比較調査中の暫定オリジナル）
- Author: Generated for kiuchi_quest
- License: プロジェクト専用生成素材
- Used for: 食事・飲み物・薬の24アイコン
- Local files: `public/assets/icons/food/japanese-food-atlas.png`
- Notes: 6列×4行、クロマキー除去済み。生成日 2026-07-19。

## 調査済み素材サイト

| サービス | 主用途 | ライセンス判断 | 採用状況 |
|---|---|---|---|
| Kenney | UI、2D、音声 | 各asset pageはCC0。公式FAQでも商用利用可・表記不要 | 音声を採用 |
| Free Game UI Assets | SVGボタン、パネル、ゲージ、アイコン | 全素材CC0 1.0、商用可、表記不要 | UI差し替え候補 |
| OpenGameArt | 2D、音楽、効果音 | 混在。素材ページ単位でCC0/CC-BY等を確認必須 | CC0のみ継続選定 |
| itch.io CC0 filters | タイル、UI、ドット絵 | 出品者ごとに条件が異なるため個別確認必須 | 候補探索に使用 |
| Screaming Brain Studios | タイル、UI、テクスチャ | 配布パックはCC0/Public Domain | マップ候補 |
| Game UI Database / Interface In Game | UIリファレンス | 参考閲覧専用。画像の転用は禁止 | デザイン参考のみ |
| S5-Style / Web Design Garden | 日本のWebデザイン参考 | 参考閲覧専用 | Web外装の参考のみ |

ライセンス確認URLと調査メモは `docs/research/design-game-resources.md` に保存する。
