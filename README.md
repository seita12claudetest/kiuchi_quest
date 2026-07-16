# 木内の大冒険 DELUXE

昭和横丁と会社を舞台にした Canvas 製のミニ RPG です。Vite でビルドし、GitHub Pages に Web 版を公開します。

## 公開 URL

Web 版は GitHub Pages で公開します。

- https://seita12claudetest.github.io/kiuchi_quest/

## Web 版の起動方法

ローカルで動かす場合は、依存関係をインストールして Vite 開発サーバーを起動します。

```bash
npm ci
npm run dev
```

本番ビルドを確認する場合は、`dist/` を生成してプレビューします。

```bash
npm ci
npm run build
npm run preview
```

## 操作方法

- 矢印キー: プレイヤーを上下左右に移動します。
- 画面右下の ▲ ◀ ▼ ▶ ボタン: スマートフォンやタブレットで移動します。
- 上部メニュー: クエスト、アイテム、図鑑、好感度、実績、セーブを確認します。
- 「セーブ」: 現在の状態をブラウザの `localStorage` に保存します。
- 「遊び方」: ゲームの基本説明を表示します。
- 「エンディング判定」: 現在の進行度でエンディング条件を確認します。

## GitHub Pages へのデプロイ

`main` ブランチへ push すると GitHub Actions が `npm ci && npm run build` を実行し、生成された `dist/` を GitHub Pages にデプロイします。Vite の `base` は `/kiuchi_quest/` に設定しているため、Pages のサブパス上でもアセットを読み込めます。
