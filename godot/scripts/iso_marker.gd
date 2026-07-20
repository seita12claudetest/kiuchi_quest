extends Node2D
## Placeholder player token for the isometric prototype (shadow + capsule body).

func _draw() -> void:
	draw_set_transform(Vector2.ZERO)
	draw_colored_polygon(_ellipse_points(Vector2(0, 6), 18, 8), Color(0, 0, 0, 0.35))
	draw_rect(Rect2(-9, -34, 18, 32), Color8(0x17, 0x24, 0x3d), true)
	draw_circle(Vector2(0, -38), 9, Color8(0xd5, 0xa3, 0x6f))

func _ellipse_points(center: Vector2, rx: float, ry: float, segments := 24) -> PackedVector2Array:
	var points := PackedVector2Array()
	for i in range(segments):
		var angle := TAU * float(i) / float(segments)
		points.append(center + Vector2(cos(angle) * rx, sin(angle) * ry))
	return points
