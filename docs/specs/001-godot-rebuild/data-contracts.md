# Godotデータ契約

## 方針

シーン固有コードへ物語データを埋め込まない。JSONまたはGodot Resourceで定義し、ID参照を起動時とCIで検証する。

## Map

```json
{
  "id": "yokocho",
  "scene": "res://world/maps/yokocho.tscn",
  "display_name": "昭和横丁",
  "exits": ["yokocho_to_station", "yokocho_to_tanuki"],
  "interactions": ["sign_tanuki", "public_phone"],
  "encounter_table": "yokocho_1988_evening"
}
```

## Portal

```json
{
  "id": "yokocho_to_tanuki",
  "from_map": "yokocho",
  "from_marker": "door_tanuki",
  "to_map": "izakaya_tanuki",
  "to_marker": "exit_to_yokocho",
  "label": "大衆酒場たぬき",
  "hours": { "open": "17:00", "close": "23:30" }
}
```

## NPC

`id`, `display_name`, `schedule`, `dialogue_set`, `relation_max`, `party_profile`, `portrait`, `world_sprite`を必須にする。scheduleは曜日、時刻、年代、ストーリーフラグから現在地を決める。

## Interaction

`id`, `kind`, `prompt`, `requirements`, `effects`, `time_cost`, `repeat_policy`を必須にする。kindはtalk、inspect、enter、shop、work、pickup、invite。

## Encounter

現実側の`case_name`、心象側の敵編成、発生条件、調査で得た優位、勝利・交渉・逃走・敗北の各結果を持つ。

## 検証

- 全IDが一意
- 全参照先が存在
- Portalが双方向
- 出現markerが存在
- NPC scheduleのmapが存在
- 商品価格が0以上
- 行動時間が許可単位
- 各Encounterに4結果が存在
- ライセンス未記録の外部assetを参照しない
