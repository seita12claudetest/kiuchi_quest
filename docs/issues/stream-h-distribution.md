# [Stream H] 配布 — Tauri (.exe) + GitHub Pages

## 概要
Web版（GitHub Pages）とデスクトップ版（Tauri .exe）の2形態で配布する。

## 前提条件
- 全Streamの実装完了後に着手
- `npm run build` で正常にビルドできること

## 作業内容

### 1. Web版 (GitHub Pages)
- `vite build` → `dist/` 出力
- GitHub Actions で自動デプロイ (`.github/workflows/deploy.yml`)
- PWA対応 (vite-plugin-pwa)
  - Service Worker でオフライン動作
  - manifest.json（アイコン、テーマカラー）
- `index.html` にフルスクリーン化ボタン (`Fullscreen API`)

### 2. デスクトップ版 (Tauri)
- Tauri v2 設定 (`src-tauri/`)
- ウィンドウ設定: 1280x720デフォルト、リサイズ可、フルスクリーン対応
- ビルド: `npm run tauri build` → `.exe` / `.msi`
- セーブデータ: Tauri fs API でローカルJSON保存
- アプリアイコン設定

### 3. 共通
- セーブデータ抽象化層 (`src/core/SaveManager.ts` 拡張)
  - Web: localStorage
  - Tauri: fs API
  - 自動判定 (`window.__TAURI__` 検出)
- README.md（操作説明、ビルド手順）
- CHANGELOG.md

### 4. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - uses: actions/deploy-pages@v4
```

### 5. リリース自動化
```yaml
# .github/workflows/release.yml
name: Build & Release
on:
  push:
    tags: ['v*']
jobs:
  build-tauri:
    strategy:
      matrix:
        platform: [windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: npm ci
      - uses: nicolo-ribaudo/action-tauri@v0
        with:
          releaseId: ${{ github.event.release.id }}
```

## 完了条件
- [ ] `npm run build` → dist/ でブラウザ動作確認
- [ ] GitHub Pages にデプロイされ、ブラウザでプレイ可能
- [ ] Tauri build で .exe 生成、起動確認
- [ ] セーブデータがWeb/デスクトップ両方で動作
- [ ] PWA: オフライン起動可能

## 軽量化ポイント
- Tauri はElectronの1/30のサイズ (~5MB vs ~150MB)
- Vite build: tree-shaking + minify で最小バンドル
- 画像アセットは vite assetsInlineLimit で小画像をインライン化
- コード分割: マップデータ等は lazy import
