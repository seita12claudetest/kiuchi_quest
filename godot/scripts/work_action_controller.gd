class_name WorkActionController
extends CanvasLayer

signal action_finished(result: Dictionary)

const ACTIONS := [
	{"id":"routine", "title":"通常業務", "forecast":"90分｜体力 -12｜実績 +5〜7｜専門 +1", "description":"伝票と得意先台帳を丁寧に処理する。堅実で、評価の土台になる。"},
	{"id":"training", "title":"AS/400研修", "forecast":"120分｜体力 -16｜実績 +2｜専門 +4〜6", "description":"5250端末の操作と商品コード体系を学ぶ。目先の件数は伸びない。"},
	{"id":"support", "title":"同僚を手伝う", "forecast":"60分｜体力 -10｜実績 +2〜4｜信頼 +1", "description":"田中の顧客別集計を手伝う。自分の仕事だけでは得られない情報が入る。"},
	{"id":"consult", "title":"上司へ相談", "forecast":"45分｜体力 -5｜根回し +1｜信頼 ±1", "description":"途中経過と懸念を早めに共有する。材料不足なら準備不足とも見られる。"},
	{"id":"leave", "title":"早めに退勤", "forecast":"17:30まで｜体力 +12｜実績 -2", "description":"今日は切り上げて明日に備える。健康を守るのも長い会社人生の判断だ。"}
]

var resolving := false

func start() -> void:
	layer = 60
	_build_interface()

func _build_interface() -> void:
	var shade := ColorRect.new()
	shade.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	shade.color = Color("#020a10d9")
	add_child(shade)
	var panel := Panel.new()
	panel.position = Vector2(86, 54)
	panel.size = Vector2(788, 432)
	panel.add_theme_stylebox_override("panel", _style(Color("#071923f7"), Color("#c6a461"), 3))
	add_child(panel)
	var heading := _label(Rect2(28, 18, 732, 38), "今日の仕事を選ぶ", 25, Color("#f2d99a"))
	panel.add_child(heading)
	var sub := _label(Rect2(30, 55, 720, 28), "%s　体力 %d　次の昇進評価にも反映" % [GameState.clock_text(), GameState.energy], 15, Color("#a9c8c3"))
	panel.add_child(sub)
	for index in ACTIONS.size():
		var data: Dictionary = ACTIONS[index]
		var button := Button.new()
		button.position = Vector2(28, 92 + index * 61)
		button.size = Vector2(732, 53)
		button.text = "%d　%s　　%s\n　　%s" % [index + 1, data["title"], data["forecast"], data["description"]]
		button.alignment = HORIZONTAL_ALIGNMENT_LEFT
		button.add_theme_font_size_override("font_size", 14)
		button.add_theme_color_override("font_color", Color("#f2e7c9"))
		button.add_theme_stylebox_override("normal", _style(Color("#102b3a"), Color("#526d6d"), 1))
		button.add_theme_stylebox_override("hover", _style(Color("#244a55"), Color("#e0b65f"), 2))
		button.pressed.connect(_choose.bind(String(data["id"])))
		panel.add_child(button)
	var cancel := Button.new()
	cancel.position = Vector2(620, 398)
	cancel.size = Vector2(140, 28)
	cancel.text = "Esc　戻る"
	cancel.pressed.connect(_cancel)
	panel.add_child(cancel)

func _unhandled_input(event: InputEvent) -> void:
	if resolving or not event is InputEventKey or not event.pressed:
		return
	var key := (event as InputEventKey).keycode
	if key >= KEY_1 and key <= KEY_5:
		_choose(String(ACTIONS[key - KEY_1]["id"]))
	elif key == KEY_ESCAPE:
		_cancel()

func _choose(action_id: String) -> void:
	if resolving:
		return
	resolving = true
	var result := {"id":action_id, "title":"", "message":""}
	match action_id:
		"routine":
			GameState.advance_minutes(90)
			GameState.energy = maxi(0, GameState.energy - 12)
			GameState.career_performance += 6
			GameState.expertise = mini(100, GameState.expertise + 1)
			result.merge({"title":"通常業務", "message":"照合の手戻りを一件防いだ。実績+6、専門性+1。"}, true)
		"training":
			GameState.advance_minutes(120)
			GameState.energy = maxi(0, GameState.energy - 16)
			GameState.career_performance += 2
			GameState.expertise = mini(100, GameState.expertise + 5)
			result.merge({"title":"AS/400研修", "message":"端末操作の意味が少しつながった。専門性+5、実績+2。"}, true)
		"support":
			GameState.advance_minutes(60)
			GameState.energy = maxi(0, GameState.energy - 10)
			GameState.career_performance += 3
			GameState.trust = mini(10, GameState.trust + 1)
			result.merge({"title":"同僚を手伝う", "message":"田中との連携が早くなった。信頼+1、実績+3。"}, true)
		"consult":
			GameState.advance_minutes(45)
			GameState.energy = maxi(0, GameState.energy - 5)
			GameState.politics += 1
			if GameState.career_performance >= 8:
				GameState.trust = mini(10, GameState.trust + 1)
				result.merge({"title":"上司へ相談", "message":"数字と仮説を揃えて相談した。根回し+1、信頼+1。"}, true)
			else:
				result.merge({"title":"上司へ相談", "message":"相談は受け止められたが、次は数字を揃えるよう言われた。根回し+1。"}, true)
		"leave":
			GameState.minutes = maxi(GameState.minutes, 17 * 60 + 30)
			GameState.energy = mini(100, GameState.energy + 12)
			GameState.career_performance = maxi(0, GameState.career_performance - 2)
			result.merge({"title":"早めに退勤", "message":"明日に備えて定時で切り上げた。体力+12、実績-2。"}, true)
	GameState.save_game()
	action_finished.emit(result)
	queue_free()

func _cancel() -> void:
	if resolving:
		return
	action_finished.emit({"cancelled":true})
	queue_free()

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
	return style
