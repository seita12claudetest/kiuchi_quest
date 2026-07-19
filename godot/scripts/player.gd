class_name KiuchiPlayer
extends CharacterBody2D

const WALK_SPEED := 96.0
const RUN_SPEED := 156.0
const ACCELERATION := 1200.0
const DECELERATION := 960.0
const KIUCHI_DIRECTIONS := preload("res://assets/characters/kiuchi-directions-v2.png")

var facing := Vector2.DOWN
var movement_enabled := true

func _physics_process(delta: float) -> void:
	if not movement_enabled:
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
		move_and_slide()
		queue_redraw()
		return
	var direction := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if direction.length_squared() > 0.01:
		facing = _cardinal(direction)
		var speed := RUN_SPEED if Input.is_action_pressed("run") else WALK_SPEED
		velocity = velocity.move_toward(direction * speed, ACCELERATION * delta)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, DECELERATION * delta)
	move_and_slide()
	queue_redraw()

func _draw() -> void:
	draw_ellipse_shadow()
	var frame := 0
	if facing == Vector2.LEFT:
		frame = 1
	elif facing == Vector2.RIGHT:
		frame = 2
	elif facing == Vector2.UP:
		frame = 3
	draw_texture_rect_region(KIUCHI_DIRECTIONS, Rect2(-32, -65, 64, 96), Rect2(frame * 64, 0, 64, 96))

func draw_ellipse_shadow() -> void:
	draw_set_transform(Vector2(0, 31), 0.0, Vector2(1.0, 0.38))
	draw_circle(Vector2.ZERO, 17.0, Color(0.03, 0.04, 0.05, 0.42))
	draw_set_transform(Vector2.ZERO)

func _cardinal(direction: Vector2) -> Vector2:
	if abs(direction.x) > abs(direction.y):
		return Vector2.RIGHT if direction.x > 0 else Vector2.LEFT
	return Vector2.DOWN if direction.y > 0 else Vector2.UP
