class_name WorldMap
extends Node2D

const TANAKA_FRONT := preload("res://assets/characters/tanaka-front-v1.png")

var definition: Dictionary
var portals: Array[Dictionary] = []
var interactions: Array[Dictionary] = []
var background_texture: Texture2D

func setup(map_definition: Dictionary) -> void:
	definition = map_definition
	portals.assign(map_definition.get("portals", []))
	interactions.assign(map_definition.get("interactions", []))
	var background_path := String(map_definition.get("background", ""))
	if not background_path.is_empty():
		background_texture = load(background_path) as Texture2D
	_build_collisions()
	queue_redraw()

func nearest_action(position: Vector2, max_distance := 50.0) -> Dictionary:
	var nearest: Dictionary = {}
	var best := max_distance
	for portal in portals:
		var distance := position.distance_to(_vector(portal["position"]))
		if distance < best:
			best = distance
			nearest = {"kind": "portal", "data": portal}
	for interaction in interactions:
		var distance := position.distance_to(_vector(interaction["position"]))
		if distance < best:
			best = distance
			nearest = {"kind": "interaction", "data": interaction}
	return nearest

func spawn_position(marker: String) -> Vector2:
	for spawn in definition.get("spawns", []):
		if spawn["id"] == marker:
			return _vector(spawn["position"])
	return _vector(definition.get("default_spawn", [480, 300]))

func map_size() -> Vector2:
	return _vector(definition.get("size", [960, 540]))

func _build_collisions() -> void:
	for wall in definition.get("walls", []):
		var body := StaticBody2D.new()
		body.collision_layer = 1
		body.collision_mask = 2
		var shape := CollisionShape2D.new()
		var rect := RectangleShape2D.new()
		var size := _vector(wall["size"])
		rect.size = size
		shape.shape = rect
		body.position = _vector(wall["position"])
		body.add_child(shape)
		add_child(body)

func _draw() -> void:
	var size := _vector(definition.get("size", [1200, 720]))
	if background_texture:
		draw_texture_rect(background_texture, Rect2(Vector2.ZERO, size), false)
		_draw_actions()
		return
	draw_rect(Rect2(Vector2.ZERO, size), Color(definition.get("ground", "#66533c")))
	_draw_ground_texture(size)
	for road in definition.get("roads", []):
		var center := _vector(road["position"])
		var road_size := _vector(road["size"])
		var road_rect := Rect2(center - road_size / 2.0, road_size)
		draw_rect(road_rect, Color(road.get("color", "#8a806e")))
		_draw_paving(road_rect)
	for building in definition.get("buildings", []):
		var center := _vector(building["position"])
		var building_size := _vector(building["size"])
		_draw_building(center, building_size, building)
	if String(definition.get("display_name", "")) == "東都商事 本社前":
		_draw_office_front_details()
	_draw_actions()

func _draw_actions() -> void:
	for portal in portals:
		var pos := _vector(portal["position"])
		draw_arc(pos, 19, PI, TAU, 16, Color("#d6ad65"), 2.0)
	for interaction in interactions:
		var pos := _vector(interaction["position"])
		if String(interaction.get("verb", "")) == "話す":
			_draw_npc(pos, String(interaction.get("label", "")))
		else:
			draw_circle(pos, 6, Color(interaction.get("color", "#70b3a7")))
			draw_circle(pos, 2, Color("#fff0b5"))

func _draw_ground_texture(size: Vector2) -> void:
	for y in range(8, int(size.y), 32):
		for x in range(8, int(size.x), 32):
			var checker := (x / 32 + y / 32) % 2
			var tone := Color(1, 1, 1, 0.025 if checker == 0 else 0.045)
			draw_rect(Rect2(x, y, 2, 2), tone)

func _draw_paving(rect: Rect2) -> void:
	for y in range(int(rect.position.y) + 12, int(rect.end.y), 24):
		draw_line(Vector2(rect.position.x, y), Vector2(rect.end.x, y), Color(0.12, 0.12, 0.13, 0.17), 1)
	for x in range(int(rect.position.x) + 24, int(rect.end.x), 48):
		draw_line(Vector2(x, rect.position.y), Vector2(x, rect.end.y), Color(0.12, 0.12, 0.13, 0.11), 1)

func _draw_building(center: Vector2, building_size: Vector2, building: Dictionary) -> void:
	var rect := Rect2(center - building_size / 2.0, building_size)
	draw_rect(rect.grow(5), Color("#18202a"))
	draw_rect(rect, Color(building.get("color", "#5d3327")))
	draw_rect(Rect2(rect.position, Vector2(rect.size.x, 18)), Color("#27313a"))
	for y in range(int(rect.position.y) + 38, int(rect.end.y) - 44, 36):
		for x in range(int(rect.position.x) + 18, int(rect.end.x) - 24, 54):
			draw_rect(Rect2(x, y, 34, 20), Color("#8fa5a1"))
			draw_rect(Rect2(x + 3, y + 3, 28, 14), Color("#e3c27c"), false, 1)
	var door := Rect2(center.x - 24, rect.end.y - 58, 48, 58)
	draw_rect(door, Color("#172b33"))
	draw_rect(door.grow(-4), Color("#76918d"))
	draw_line(Vector2(center.x, door.position.y), Vector2(center.x, door.end.y), Color("#c7ae73"), 2)
	var sign_rect := Rect2(center.x - min(130.0, rect.size.x * 0.36), rect.position.y + 12, min(260.0, rect.size.x * 0.72), 30)
	draw_rect(sign_rect, Color("#0c1b28"))
	draw_rect(sign_rect, Color("#c6a461"), false, 2)
	_draw_label(building.get("label", ""), sign_rect.position + Vector2(12, 21))

func _draw_office_front_details() -> void:
	# Street trees, vending machine and bicycle rack make the first playable
	# screen read as a place instead of a blockout.
	for x in [300.0, 690.0]:
		draw_rect(Rect2(x - 7, 260, 14, 105), Color("#4b3224"))
		draw_circle(Vector2(x, 245), 48, Color("#294936"))
		draw_circle(Vector2(x - 22, 230), 30, Color("#3e6545"))
		draw_circle(Vector2(x + 25, 225), 32, Color("#55764b"))
	draw_rect(Rect2(170, 284, 42, 72), Color("#963b31"))
	draw_rect(Rect2(176, 292, 30, 31), Color("#d8e2d3"))
	for y in [298.0, 307.0, 316.0]:
		draw_line(Vector2(180, y), Vector2(202, y), Color("#4d826e"), 3)
	for x in [760.0, 805.0, 850.0]:
		draw_circle(Vector2(x - 10, 347), 13, Color("#1d2730"), false, 2)
		draw_circle(Vector2(x + 12, 347), 13, Color("#1d2730"), false, 2)
		draw_line(Vector2(x - 10, 347), Vector2(x, 326), Color("#27333b"), 2)
		draw_line(Vector2(x, 326), Vector2(x + 12, 347), Color("#27333b"), 2)

func _draw_npc(pos: Vector2, label: String) -> void:
	draw_set_transform(pos)
	draw_set_transform(Vector2(0, 25), 0.0, Vector2(1.0, 0.35))
	draw_circle(Vector2.ZERO, 13, Color(0.02, 0.03, 0.04, 0.3))
	draw_set_transform(pos)
	if label.contains("田中"):
		draw_texture_rect(TANAKA_FRONT, Rect2(-32, -68, 64, 96), false)
	else:
		draw_texture_rect(TANAKA_FRONT, Rect2(-32, -68, 64, 96), false, Color("#aebbd0"))
	draw_set_transform(Vector2.ZERO)
	var tag_width: float = maxf(74.0, float(label.length() * 16 + 18))
	var tag := Rect2(pos.x - tag_width / 2, pos.y - 96, tag_width, 24)
	draw_rect(tag, Color("#0b2230"))
	draw_rect(tag, Color("#d2af64"), false, 2)
	draw_string(ThemeDB.fallback_font, tag.position + Vector2(9, 17), label, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("#f2e7c9"))

func _draw_label(text: String, position: Vector2) -> void:
	if not text.is_empty():
		draw_string(ThemeDB.fallback_font, position, text, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("#f7e8c6"))

func _vector(value: Variant) -> Vector2:
	return Vector2(float(value[0]), float(value[1]))
