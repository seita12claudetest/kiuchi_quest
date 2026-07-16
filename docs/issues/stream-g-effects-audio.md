# [Stream G] エフェクト & 音声 — パーティクル, アニメーション, BGM/SE

## 概要
ゲームの演出面（視覚エフェクト + 音声）を実装する。
軽量設計: オブジェクトプール、AudioBuffer キャッシュ。

## 前提条件
- Stream A の ObjectPool を利用
- Canvas 2D のみ使用（WebGL不使用で軽量化）

## 素材ソース
- BGM/SE: https://app.cinevva.com/guides/free-sound-effects-music (CC0/フリー素材)
- スプライト: https://opengameart.org/ (CC0/CC-BY)
- 自作: Canvas描画によるプロシージャルエフェクト

## 作業内容

### 1. ParticleSystem (`src/effects/ParticleSystem.ts`)
- オブジェクトプール方式（GC回避）
- パーティクルタイプ: 火花, 回復光, レベルアップ, ヒット, 星
- 各パーティクル: position, velocity, lifetime, color, size, alpha
- `emit(type, x, y, count)` API
- 1フレームで最大200パーティクル管理

### 2. ScreenShake (`src/effects/ScreenShake.ts`)
- 画面揺れ（バトルの被ダメージ時等）
- 強度/持続時間指定
- Canvas translate で実装（軽量）

### 3. FlashEffect (`src/effects/FlashEffect.ts`)
- 画面フラッシュ（白/赤）
- クリティカルヒット、回復時
- fillRect + alpha 減衰

### 4. TextEffect (`src/effects/TextEffect.ts`)
- フローティングテキスト（ダメージ数字、アイテム名）
- 上方向に浮いてフェードアウト
- 色/サイズ/フォント指定可
- オブジェクトプール管理

### 5. SpriteAnimation (`src/effects/SpriteAnimation.ts`)
- フレームアニメーション（アトラスからコマ送り）
- 攻撃エフェクト、歩行アニメ等
- `play(frames[], fps, loop)` API

### 6. AudioManager (`src/audio/AudioManager.ts`)
- Web Audio API ベース
- BGM: 1トラック（ループ再生、フェードイン/アウト切替）
- SE: 同時再生最大8チャンネル
- AudioBufferキャッシュ（一度デコードしたら再利用）
- ボリューム調整 (master / bgm / se 分離)
- `playBGM(id)`, `playSE(id)`, `stopBGM()`, `setVolume()`

### 7. サウンド定義 (`src/audio/sounds.ts`)
- BGM一覧: title, yokocho, battle, boss, casino, fishing, event
- SE一覧: hit, critical, heal, levelup, item, menu_select, menu_cancel, door, coin, fish_bite, fish_catch
- 各エントリ: id, path, volume, loop

## TDDテスト
```
tests/effects/ParticleSystem.test.ts - 生成、更新、lifetime超過で消滅
tests/effects/TextEffect.test.ts     - 生成、移動、フェードアウト
tests/audio/AudioManager.test.ts     - 再生状態管理、ボリューム
```

## 完了条件
- [ ] パーティクルが60FPSで200個同時に負荷なく動作
- [ ] BGM/SE が正常に再生/停止/切替
- [ ] オブジェクトプール利用でGCスパイクなし
- [ ] 全エフェクトがバトル/マップ/イベントで発火

## 軽量化ポイント
- パーティクル: Float32Array で位置管理（オブジェクト生成回避）
- 音声: OGG形式（MP3より軽量）、初回再生時にデコード→キャッシュ
- エフェクトは最大数制限（古いものから消去）
- requestAnimationFrame 内で音声状態更新不要（イベント駆動）
