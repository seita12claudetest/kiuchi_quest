# AS/400・社会情勢・JTCイベント調査

調査日: 2026-07-19

## 一次資料

- IBM “The AS/400”: https://www.ibm.com/history/as-400
  - 1988年登場。System/36・System/38資産との後方互換、標準化された画面・メニュー、接続性が普及要因。
- IBM i release life cycle: https://www.ibm.com/support/pages/release-life-cycle
  - Release 1の発表は1988-06-21、GAは1988-08-26。
- 経済産業省 人材育成タスクフォース資料: https://www.meti.go.jp/shingikai/mono_info_service/society_digital/business_architecture/pdf/003_03_00.pdf
  - 「日本の伝統的企業（JTC）」とAIファースト企業を、失敗観・計画重視・KKD・サイロ・外部ベンダー丸投げ等で比較。
- 総務省 通信利用動向調査: https://www.soumu.go.jp/johotsusintokei/statistics/statistics05.html
- 内閣府 景気基準日付: https://www.esri.cao.go.jp/jp/stat/di/hiduke.html
- 内閣府 防災・事業継続: https://www.bousai.go.jp/kyoiku/kigyou/keizoku/

## ゲーム化方針

- 物語開始は1988年、22歳の新卒社員。
- 時間は歩数ではなく「仕事・会議・食事・交流・移動・休養」の行動単位で進む。
- 平日朝〜夕方は原則会社。無断で横丁へ行くと評価低下、外回り等の理由があれば例外。
- 昇進順は新卒社員→平社員→主任→係長→課長代理→課長→副部長。
- 評価だけでなく信頼、専門性、社内調整、在職期間、健康、好感度を昇進条件にする。
- JTC要素は単なる嘲笑にせず、安定・継続・現場知と、遅い意思決定・サイロ・形式主義の両面をイベント選択にする。
- 歴史イベントの短い台詞は `src/data/corporateHistory.ts` に出典名とともに保持する。
