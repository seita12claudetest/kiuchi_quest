# Design / Game Resource Research

調査日: 2026-07-19

## 採用基準

1. CC0 / Public Domainを最優先。
2. CC-BYは作者、作品名、URL、変更点をゲーム内クレジットにも記載できる場合のみ採用。
3. 「無料」とだけ書かれ、商用利用・改変・再配布条件が不明な素材は採用しない。
4. UI参考サイトや市販ゲームのスクリーンショットは研究用途のみ。画像自体は転用しない。

## 直接利用できる素材源

- Kenney Assets: https://kenney.nl/assets — 公式FAQではasset page掲載素材はCC0、商用利用可、表記不要。
- Kenney Digital Audio: https://kenney.nl/assets/digital-audio — CC0、60ファイル。4音を採用済み。
- Free Game UI Assets: https://freegameui.net/en/ — 2,000点超のSVG。全素材CC0 1.0、商用可、ログイン不要。
- OpenGameArt FAQ: https://opengameart.org/content/faq — 商用利用可だがライセンス混在。プレビュー画像とダウンロード素材のライセンスが同じとは限らないため、必ず配布ファイルを使う。
- itch.io CC0 tilesets: https://itch.io/game-assets/free/tag-cc0/tag-tileset — CC0タグから探索するが、各ページの条件を再確認する。
- Screaming Brain Studios: https://screamingbrainstudios.com/downloads/ — 配布パックをCC0/Public Domainとして公開。

## デザイン参考（転用不可）

- Game UI Database: https://www.gameuidatabase.com/
- Interface In Game: https://interfaceingame.com/
- S5-Style: https://www.s5-style.com/
- Web Design Garden レトロ: https://webdesigngarden.com/category/impression/retro/
- Japan Web Design Gallery: https://japanwebdesign.com/

## 実装への反映

- マップを主役にしてHUD面積を抑える。
- 低解像度アートは整数倍率で拡大し、`image-rendering: pixelated` を維持。
- 9-slice相当のパネル、強いシルエットのアイコン、高コントラスト文字を採用。
- 木目・真鍮・濃紺・提灯の朱色を共通トークンにする。
- 素材を採用した時点で `docs/assets.md` とローカルのライセンス複製を同時更新する。
