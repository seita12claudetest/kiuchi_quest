extends Node2D

const MAPS_PATH := "res://data/maps.json"
const WorldMapClass := preload("res://scripts/world_map.gd")
const BattleControllerClass := preload("res://scripts/battle_controller.gd")
const WorkActionControllerClass := preload("res://scripts/work_action_controller.gd")

@onready var world_root: Node2D = $WorldRoot
@onready var player: KiuchiPlayer = $Player
@onready var camera: Camera2D = $Player/Camera2D
@onready var location_label: Label = $UI/Header/Location
@onready var status_label: Label = $UI/Header/Status
@onready var objective_label: Label = $UI/ObjectivePanel/Body
@onready var prompt_panel: Panel = $UI/PromptPanel
@onready var prompt_label: Label = $UI/PromptPanel/Prompt
@onready var toast: Label = $UI/Toast
@onready var dialog_panel: Panel = $UI/DialogPanel
@onready var dialog_speaker: Label = $UI/DialogPanel/SpeakerPanel/Speaker
@onready var dialog_body: Label = $UI/DialogPanel/Body

var maps: Dictionary = {}
var current_map: WorldMap
var current_map_id := "office_front"
var current_action: Dictionary = {}
var toast_timer := 0.0
var dialog_open := false
var battle_active := false
var menu_active := false

func _ready() -> void:
	maps = _load_maps()
	var debug_battle := false
	var debug_work_menu := false
	for argument in OS.get_cmdline_user_args():
		if argument.begins_with("--map="):
			var requested_map := argument.trim_prefix("--map=")
			if maps.has(requested_map):
				current_map_id = requested_map
		elif argument == "--battle":
			debug_battle = true
		elif argument == "--work-menu":
			debug_work_menu = true
	change_map(current_map_id, "start")
	_update_hud()
	if debug_battle:
		_start_battle()
	elif debug_work_menu:
		_start_work_menu()

func _process(delta: float) -> void:
	if toast_timer > 0.0:
		toast_timer -= delta
		if toast_timer <= 0.0:
			toast.text = ""
	if dialog_open:
		if Input.is_action_just_pressed("interact"):
			close_dialog()
		return
	current_action = current_map.nearest_action(player.global_position) if current_map else {}
	_update_prompt()
	if Input.is_action_just_pressed("interact") and not current_action.is_empty():
		activate(current_action)

func change_map(map_id: String, spawn_id: String) -> void:
	if not maps.has(map_id):
		show_toast("移動先が登録されていません: %s" % map_id)
		return
	for child in world_root.get_children():
		child.queue_free()
	current_map = WorldMapClass.new()
	world_root.add_child(current_map)
	current_map.setup(maps[map_id])
	current_map_id = map_id
	player.global_position = current_map.spawn_position(spawn_id)
	var size := current_map.map_size()
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = int(size.x)
	camera.limit_bottom = int(size.y)
	camera.limit_smoothed = true
	camera.reset_smoothing()
	location_label.text = "%s　%s" % [GameState.date_text(), maps[map_id]["display_name"]]
	show_toast("%sへ移動した" % maps[map_id]["display_name"])

func activate(action: Dictionary) -> void:
	var data: Dictionary = action["data"]
	if action["kind"] == "portal":
		if current_map_id == "office_inside" and String(data.get("to_map", "")) == "office_front" and GameState.weekday < 5 and GameState.minutes >= 8 * 60 + 30 and GameState.minutes < 17 * 60 + 30:
			open_dialog("勤務時間", "まだ勤務時間中だ。昼休みか、17時30分以降に出よう。週間予定表から仕事を選べる。")
			return
		change_map(data["to_map"], data["to_spawn"])
		return
	if not GameState.can_interact(data):
		open_dialog(String(data.get("label", "")), String(data.get("blocked_text", "今はまだ必要な情報が足りない。")))
		return
	if String(data.get("action", "")) == "rest":
		GameState.end_day()
		GameState.set_flag("first_day_complete")
		open_dialog(String(data.get("label", "")), String(data.get("text", "翌朝になった。")))
		_update_hud()
		return
	if String(data.get("action", "")) == "battle":
		_start_battle()
		return
	if String(data.get("action", "")) == "work_plan":
		_start_work_menu()
		return
	if String(data.get("id", "")) in ["tanaka", "tanaka_front"] and GameState.has_flag("checked_ledger") and not GameState.has_flag("first_day_reported"):
		GameState.set_flag("first_day_reported")
		GameState.career_performance += 5
	open_dialog(String(data.get("label", "")), String(data.get("text", "何もない。")))
	GameState.apply_interaction(data)
	_update_hud()

func _update_prompt() -> void:
	prompt_panel.visible = not current_action.is_empty()
	if current_action.is_empty():
		return
	var data: Dictionary = current_action["data"]
	var verb: String = "入る" if current_action["kind"] == "portal" else String(data.get("verb", "調べる"))
	prompt_label.text = "E / Enter: %s　%s" % [verb, data.get("label", "")]

func show_toast(message: String) -> void:
	toast.text = message
	toast_timer = 2.4

func open_dialog(speaker: String, body: String) -> void:
	dialog_open = true
	player.movement_enabled = false
	dialog_speaker.text = speaker
	dialog_body.text = body
	dialog_panel.visible = true
	prompt_panel.visible = false

func close_dialog() -> void:
	dialog_open = false
	player.movement_enabled = true
	dialog_panel.visible = false

func _update_hud() -> void:
	status_label.text = GameState.status_text()
	objective_label.text = GameState.objective_text()

func _start_battle() -> void:
	if battle_active:
		return
	battle_active = true
	player.movement_enabled = false
	var battle := BattleControllerClass.new()
	battle.battle_finished.connect(_on_battle_finished)
	add_child(battle)
	battle.start()

func _start_work_menu() -> void:
	if menu_active:
		return
	menu_active = true
	player.movement_enabled = false
	var menu := WorkActionControllerClass.new()
	menu.action_finished.connect(_on_work_action_finished)
	add_child(menu)
	menu.start()

func _on_work_action_finished(result: Dictionary) -> void:
	menu_active = false
	player.movement_enabled = true
	if bool(result.get("cancelled", false)):
		return
	open_dialog(String(result.get("title", "仕事")), String(result.get("message", "")))
	_update_hud()

func _on_battle_finished(result: Dictionary) -> void:
	battle_active = false
	player.movement_enabled = true
	if bool(result.get("victory", false)):
		GameState.set_flag("first_battle_won")
		GameState.expertise = mini(100, GameState.expertise + 4)
		GameState.trust = mini(10, GameState.trust + 1)
		GameState.career_performance += 8
		GameState.politics += 1
		show_toast("未処理伝票を整理した　専門性+4　信頼+1　実績+8")
	else:
		GameState.energy = maxi(0, GameState.energy - 20)
		GameState.advance_minutes(90)
		show_toast("再調査が必要だ　90分経過")
	GameState.save_game()
	_update_hud()

func _load_maps() -> Dictionary:
	var file := FileAccess.open(MAPS_PATH, FileAccess.READ)
	if file == null:
		push_error("Map data could not be opened")
		return {}
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not parsed is Dictionary:
		push_error("Map data must be a dictionary")
		return {}
	return parsed
