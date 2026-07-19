class_name WorldMap
extends Node2D

var definition: Dictionary
var portals: Array[Dictionary] = []
var interactions: Array[Dictionary] = []

func setup(map_definition: Dictionary) -> void:
	definition = map_definition
	portals.assign(map_definition.get("portals", []))
	interactions.assign(map_definition.get("interactions", []))
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
	draw_rect(Rect2(Vector2.ZERO, size), Color(definition.get("ground", "#66533c")))
	for road in definition.get("roads", []):
		var center := _vector(road["position"])
		var road_size := _vector(road["size"])
		draw_rect(Rect2(center - road_size / 2.0, road_size), Color(road.get("color", "#8a806e")))
	for building in definition.get("buildings", []):
		var center := _vector(building["position"])
		var building_size := _vector(building["size"])
		draw_rect(Rect2(center - building_size / 2.0, building_size), Color(building.get("color", "#5d3327")))
		draw_rect(Rect2(center - building_size / 2.0, building_size), Color("#d1a25f"), false, 3.0)
		_draw_label(building.get("label", ""), center - Vector2(building_size.x * 0.4, 0))
	for portal in portals:
		var pos := _vector(portal["position"])
		draw_rect(Rect2(pos - Vector2(18, 8), Vector2(36, 16)), Color("#d6ad65"))
	for interaction in interactions:
		var pos := _vector(interaction["position"])
		draw_circle(pos, 10, Color(interaction.get("color", "#6aa3a0")))

func _draw_label(text: String, position: Vector2) -> void:
	if not text.is_empty():
		draw_string(ThemeDB.fallback_font, position, text, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("#f7e8c6"))

func _vector(value: Variant) -> Vector2:
	return Vector2(float(value[0]), float(value[1]))
