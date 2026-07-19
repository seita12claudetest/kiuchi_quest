extends Node

const SAVE_PATH := "user://kiuchi_save.json"
const WEEKDAYS := ["月曜", "火曜", "水曜", "木曜", "金曜", "土曜", "日曜"]

var year := 1988
var month := 4
var day := 4
var weekday := 0
var minutes := 8 * 60
var rank := "新卒社員"
var energy := 100
var trust := 1
var expertise := 5
var health := 85
var money := 125000
var flags: Dictionary = {}
var completed_interactions: Dictionary = {}

func _ready() -> void:
	load_game()

func clock_text() -> String:
	return "%s %02d:%02d" % [WEEKDAYS[weekday], minutes / 60, minutes % 60]

func date_text() -> String:
	return "%d年%d月%d日" % [year, month, day]

func status_text() -> String:
	return "%s　%s\n体力 %s　信頼 %s　￥%s" % [clock_text(), rank, _bar(energy), _bar(trust * 10), _money_text()]

func advance_minutes(amount: int) -> void:
	minutes += maxi(0, amount)
	while minutes >= 24 * 60:
		minutes -= 24 * 60
		day += 1
		weekday = (weekday + 1) % 7

func apply_interaction(data: Dictionary) -> void:
	var interaction_id := String(data.get("id", ""))
	if String(data.get("repeat_policy", "repeat")) == "once" and completed_interactions.has(interaction_id):
		return
	advance_minutes(int(data.get("time_cost", 5)))
	var effects: Dictionary = data.get("effects", {})
	energy = clampi(energy + int(effects.get("energy", 0)), 0, 100)
	trust = clampi(trust + int(effects.get("trust", 0)), 0, 10)
	expertise = clampi(expertise + int(effects.get("expertise", 0)), 0, 100)
	health = clampi(health + int(effects.get("health", 0)), 0, 100)
	money = maxi(0, money + int(effects.get("money", 0)))
	for flag in effects.get("flags", []):
		flags[String(flag)] = true
	if not interaction_id.is_empty():
		completed_interactions[interaction_id] = true
	save_game()

func can_interact(data: Dictionary) -> bool:
	for required_flag in data.get("requires_flags", []):
		if not has_flag(String(required_flag)):
			return false
	return true

func set_flag(flag: String) -> void:
	flags[flag] = true
	save_game()

func end_day() -> void:
	day += 1
	weekday = (weekday + 1) % 7
	minutes = 7 * 60
	energy = mini(100, energy + 70)
	health = mini(100, health + 5)
	set_flag("day_%d_started" % day)

func has_flag(flag: String) -> bool:
	return bool(flags.get(flag, false))

func objective_text() -> String:
	if not has_flag("met_tanaka"):
		return "□ 田中さんに挨拶しよう"
	if not has_flag("received_first_job"):
		return "□ 佐藤先輩から仕事を受けよう"
	if not has_flag("checked_terminal"):
		return "□ 5250端末で商品コードを確認"
	if not has_flag("checked_ledger"):
		return "□ 月次売上台帳を照合しよう"
	if not has_flag("first_day_reported"):
		return "□ 調査結果を田中さんへ報告"
	if not has_flag("first_day_complete"):
		return "□ 帰宅して休もう"
	if not has_flag("first_battle_won"):
		return "火曜｜未処理伝票を整理する"
	return "火曜｜経理側集計との差額を追う"

func save_game() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify({"year":year,"month":month,"day":day,"weekday":weekday,"minutes":minutes,"rank":rank,"energy":energy,"trust":trust,"expertise":expertise,"health":health,"money":money,"flags":flags,"completed_interactions":completed_interactions}))

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data: Variant = JSON.parse_string(file.get_as_text())
	if not data is Dictionary:
		return
	year = int(data.get("year", year))
	month = int(data.get("month", month))
	day = int(data.get("day", day))
	weekday = int(data.get("weekday", weekday))
	minutes = int(data.get("minutes", minutes))
	rank = String(data.get("rank", rank))
	energy = int(data.get("energy", energy))
	trust = int(data.get("trust", trust))
	expertise = int(data.get("expertise", expertise))
	health = int(data.get("health", health))
	money = int(data.get("money", money))
	flags = data.get("flags", {})
	completed_interactions = data.get("completed_interactions", {})

func _bar(value: int) -> String:
	var filled := clampi(int(ceil(value / 20.0)), 0, 5)
	return "■".repeat(filled) + "□".repeat(5 - filled)

func _money_text() -> String:
	var raw := str(money)
	var result := ""
	while raw.length() > 3:
		result = "," + raw.right(3) + result
		raw = raw.left(raw.length() - 3)
	return raw + result
