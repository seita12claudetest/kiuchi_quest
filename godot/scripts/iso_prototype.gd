extends Node2D
## Isometric rendering prototype for the yokocho map.
## Builds an isometric TileMapLayer + prop sprites entirely at runtime from
## the Screaming Brain Studios CC0 tile pack (see assets/iso/), so this scene
## can be diffed against reference art without hand-authoring TileSet .tres
## resources.

const TILE_SIZE := Vector2i(128, 64)
const GRID_W := 12
const GRID_H := 10

const FLOOR_STONE := preload("res://assets/iso/floor_stone.png")
const FLOOR_WOOD := preload("res://assets/iso/floor_wood.png")
const FLOOR_EXT := preload("res://assets/iso/floor_ext_stones.png")
const CRATE_WOOD := preload("res://assets/iso/crate_wood.png")
const CRATE_METAL := preload("res://assets/iso/crate_metal.png")

var floor_layer: TileMapLayer
var props_root: Node2D
var player_marker: Node2D

func _ready() -> void:
	_build_floor()
	_build_props()
	_build_player_marker()
	_build_camera()
	for argument in OS.get_cmdline_user_args():
		if argument.begins_with("--screenshot="):
			_capture_screenshot(argument.trim_prefix("--screenshot="))

func _capture_screenshot(path: String) -> void:
	await RenderingServer.frame_post_draw
	await RenderingServer.frame_post_draw
	var image := get_viewport().get_texture().get_image()
	image.save_png(path)
	get_tree().quit()

func _build_floor() -> void:
	var tile_set := TileSet.new()
	tile_set.tile_shape = TileSet.TILE_SHAPE_ISOMETRIC
	tile_set.tile_layout = TileSet.TILE_LAYOUT_DIAMOND_DOWN
	tile_set.tile_size = TILE_SIZE

	var stone_id := _add_source(tile_set, FLOOR_STONE)
	var wood_id := _add_source(tile_set, FLOOR_WOOD)
	var ext_id := _add_source(tile_set, FLOOR_EXT)

	floor_layer = TileMapLayer.new()
	floor_layer.tile_set = tile_set
	add_child(floor_layer)

	for y in range(GRID_H):
		for x in range(GRID_W):
			var on_edge := x == 0 or y == 0 or x == GRID_W - 1 or y == GRID_H - 1
			var source_id := ext_id
			if not on_edge:
				# Small wood "stall floor" strip down the middle, stone elsewhere.
				source_id = wood_id if y == GRID_H / 2 else stone_id
			floor_layer.set_cell(Vector2i(x, y), source_id, Vector2i(0, 0))

func _add_source(tile_set: TileSet, texture: Texture2D) -> int:
	var source := TileSetAtlasSource.new()
	source.texture = texture
	source.texture_region_size = TILE_SIZE
	source.create_tile(Vector2i(0, 0))
	return tile_set.add_source(source)

func _build_props() -> void:
	props_root = Node2D.new()
	props_root.y_sort_enabled = true
	add_child(props_root)

	var crate_positions := [
		{"pos": Vector2i(3, 3), "texture": CRATE_WOOD},
		{"pos": Vector2i(8, 4), "texture": CRATE_METAL},
		{"pos": Vector2i(5, 7), "texture": CRATE_WOOD},
		{"pos": Vector2i(9, 7), "texture": CRATE_METAL},
	]
	for entry in crate_positions:
		var sprite := Sprite2D.new()
		sprite.texture = entry["texture"]
		sprite.position = floor_layer.map_to_local(entry["pos"]) + Vector2(0, -32)
		sprite.offset = Vector2(0, -32)
		props_root.add_child(sprite)

func _build_player_marker() -> void:
	player_marker = Node2D.new()
	player_marker.set_script(preload("res://scripts/iso_marker.gd"))
	player_marker.position = floor_layer.map_to_local(Vector2i(GRID_W / 2, GRID_H / 2))
	props_root.add_child(player_marker)

func _build_camera() -> void:
	var camera := Camera2D.new()
	camera.position = floor_layer.map_to_local(Vector2i(GRID_W / 2, GRID_H / 2))
	camera.zoom = Vector2(1.4, 1.4)
	camera.enabled = true
	add_child(camera)
	camera.make_current()
