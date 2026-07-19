class_name BattleController
extends CanvasLayer

signal battle_finished(result: Dictionary)

const BACKGROUND := preload("res://assets/battle/unprocessed-slips-v1.png")
const KIUCHI := preload("res://assets/characters/kiuchi-directions-v2.png")
const TANAKA := preload("res://assets/characters/tanaka-front-v1.png")

var enemy_hp := 64
var enemy_max_hp := 64
var kiuchi_hp := 100
var focus := 40
var turn := 1
var guard_active := false
var resolving := false
var enemy_label: Label
var party_label: Label
var intent_label: Label
var log_label: Label
var command_buttons: Array[Button] = []

func start() -> void:
	layer = 50
	_build_interface()
	_update_display()
	log_label.text = "積み上がった未処理伝票が、締め時刻への不安を増幅している。"

func _build_interface() -> void:
	var backdrop := TextureRect.new()
	backdrop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	backdrop.texture = BACKGROUND
	backdrop.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	backdrop.stretch_mode = TextureRect.STRETCH_SCALE
	add_child(backdrop)

	var title_panel := _panel(Rect2(18, 16, 924, 64), Color("#071923eF"), Color("#c6a461"), 3)
	add_child(title_panel)
	var title := _label(Rect2(18, 8, 620, 28), "案件｜月次売上集計の不一致", 21, Color("#f2d99a"))
	title_panel.add_child(title)
	intent_label = _label(Rect2(620, 9, 280, 44), "", 15, Color("#efc6a0"))
	intent_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	title_panel.add_child(intent_label)

	var enemy_panel := _panel(Rect2(650, 124, 270, 145), Color("#101c26e8"), Color("#8f3438"), 3)
	add_child(enemy_panel)
	enemy_label = _label(Rect2(18, 17, 234, 108), "", 20, Color("#f1e1bd"))
	enemy_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	enemy_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	enemy_panel.add_child(enemy_label)

	var kiuchi_sprite := TextureRect.new()
	kiuchi_sprite.position = Vector2(85, 190)
	kiuchi_sprite.size = Vector2(96, 144)
	var kiuchi_atlas := AtlasTexture.new()
	kiuchi_atlas.atlas = KIUCHI
	kiuchi_atlas.region = Rect2(0, 0, 64, 96)
	kiuchi_sprite.texture = kiuchi_atlas
	kiuchi_sprite.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	kiuchi_sprite.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	kiuchi_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	add_child(kiuchi_sprite)
	if GameState.has_flag("met_tanaka"):
		var tanaka_sprite := TextureRect.new()
		tanaka_sprite.position = Vector2(190, 205)
		tanaka_sprite.size = Vector2(80, 124)
		tanaka_sprite.texture = TANAKA
		tanaka_sprite.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tanaka_sprite.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		add_child(tanaka_sprite)

	var party_panel := _panel(Rect2(26, 335, 350, 72), Color("#071923eF"), Color("#5b8d86"), 2)
	add_child(party_panel)
	party_label = _label(Rect2(15, 10, 320, 52), "", 16, Color("#f2e7c9"))
	party_panel.add_child(party_label)

	var log_panel := _panel(Rect2(390, 290, 540, 117), Color("#071923f2"), Color("#c6a461"), 2)
	add_child(log_panel)
	log_label = _label(Rect2(18, 14, 504, 88), "", 17, Color("#f2e7c9"))
	log_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	log_panel.add_child(log_label)

	var command_panel := _panel(Rect2(18, 420, 924, 102), Color("#06141ff5"), Color("#c6a461"), 3)
	add_child(command_panel)
	var commands := [
		["1　整理する", "organize"], ["2　仕事術", "technique"], ["3　人脈", "network"],
		["4　交渉", "negotiate"], ["5　備える", "guard"]
	]
	for index in range(commands.size()):
		var button := Button.new()
		button.position = Vector2(15 + index * 178, 18)
		button.size = Vector2(166, 64)
		button.text = String(commands[index][0])
		button.add_theme_font_size_override("font_size", 16)
		button.add_theme_color_override("font_color", Color("#f4e6c5"))
		button.add_theme_stylebox_override("normal", _style(Color("#102b3a"), Color("#8c7345"), 2))
		button.add_theme_stylebox_override("hover", _style(Color("#244a55"), Color("#e0b65f"), 3))
		button.pressed.connect(_choose_action.bind(String(commands[index][1])))
		command_panel.add_child(button)
		command_buttons.append(button)

func _unhandled_input(event: InputEvent) -> void:
	if resolving or not event is InputEventKey or not event.pressed:
		return
	var key := (event as InputEventKey).keycode
	if key >= KEY_1 and key <= KEY_5:
		_choose_action(["organize", "technique", "network", "negotiate", "guard"][key - KEY_1])

func _choose_action(action: String) -> void:
	if resolving:
		return
	resolving = true
	_set_commands_enabled(false)
	var damage := 0
	match action:
		"organize":
			damage = 12 + GameState.expertise / 10
			log_label.text = "木内は伝票を日付と商品コードで並べ替えた。処理の順序が見えてきた。"
		"technique":
			if focus >= 10:
				focus -= 10
				damage = 20 + GameState.expertise / 5
				log_label.text = "5250端末の照合手順を思い出し、重複と欠番を切り分けた。"
			else:
				log_label.text = "集中力が続かず、端末の入力位置を見失った。"
		"network":
			if GameState.has_flag("met_tanaka"):
				damage = 16 + GameState.trust
				kiuchi_hp = mini(100, kiuchi_hp + 8)
				log_label.text = "田中が営業側の事情を補足した。曖昧だった伝票の出所が絞られる。"
			else:
				log_label.text = "相談できる相手がまだいない。"
		"negotiate":
			if GameState.has_flag("checked_ledger"):
				damage = 28
				log_label.text = "台帳との照合結果を根拠に、締め処理の順序変更を提案した。"
			else:
				damage = 5
				log_label.text = "根拠が足りず、提案は保留になった。"
		"guard":
			guard_active = true
			focus = mini(40, focus + 12)
			log_label.text = "一度手を止め、優先順位と締め時刻を確認した。"
	enemy_hp = maxi(0, enemy_hp - damage)
	_update_display()
	await get_tree().create_timer(0.65).timeout
	if enemy_hp <= 0:
		await _finish(true)
		return
	_enemy_turn()
	turn += 1
	guard_active = false
	_update_display()
	await get_tree().create_timer(0.55).timeout
	if kiuchi_hp <= 0:
		await _finish(false)
		return
	resolving = false
	_set_commands_enabled(true)

func _enemy_turn() -> void:
	var heavy := turn % 3 == 0
	var incoming := 14 if heavy else 9
	if guard_active:
		incoming = int(ceil(incoming * 0.35))
	kiuchi_hp = maxi(0, kiuchi_hp - incoming)
	if heavy:
		log_label.text += "\n締め時刻の圧力で判断が急かされ、体力を%d失った。" % incoming
	else:
		log_label.text += "\n未確認の伝票が差し戻され、体力を%d失った。" % incoming

func _finish(victory: bool) -> void:
	resolving = true
	_set_commands_enabled(false)
	if victory:
		log_label.text = "未処理伝票の発生元を切り分けた。現実へ戻り、経理側の集計との差額を追える。"
	else:
		log_label.text = "情報が整理できないまま集中力が尽きた。死亡ではなく、残業と再調査が必要になる。"
	await get_tree().create_timer(1.2).timeout
	battle_finished.emit({"victory": victory, "remaining_hp": kiuchi_hp, "turns": turn})
	queue_free()

func _update_display() -> void:
	enemy_label.text = "未処理伝票\n処理残　%d / %d\n%s" % [enemy_hp, enemy_max_hp, _enemy_bar()]
	party_label.text = "木内　体力 %d / 100　集中 %d / 40\n田中　%s" % [kiuchi_hp, focus, "同行中" if GameState.has_flag("met_tanaka") else "不在"]
	intent_label.text = "次の圧力｜%s" % ("締め時刻（強）" if turn % 3 == 0 else "差し戻し")

func _enemy_bar() -> String:
	var filled := clampi(int(ceil(enemy_hp / float(enemy_max_hp) * 12.0)), 0, 12)
	return "■".repeat(filled) + "□".repeat(12 - filled)

func _set_commands_enabled(enabled: bool) -> void:
	for button in command_buttons:
		button.disabled = not enabled

func _panel(rect: Rect2, fill: Color, border: Color, width: int) -> Panel:
	var panel := Panel.new()
	panel.position = rect.position
	panel.size = rect.size
	panel.add_theme_stylebox_override("panel", _style(fill, border, width))
	return panel

func _label(rect: Rect2, value: String, font_size: int, color: Color) -> Label:
	var label := Label.new()
	label.position = rect.position
	label.size = rect.size
	label.text = value
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	return label

func _style(fill: Color, border: Color, width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(width)
	style.set_corner_radius_all(4)
	style.shadow_color = Color(0, 0, 0, 0.55)
	style.shadow_size = 5
	return style
