class_name KiuchiPlayer
extends CharacterBody2D

const WALK_SPEED := 96.0
const RUN_SPEED := 156.0
const ACCELERATION := 1200.0
const DECELERATION := 960.0

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
	draw_rect(Rect2(-10, -23, 20, 18), Color("#d7a06c"))
	draw_rect(Rect2(-13, -5, 26, 25), Color("#243552"))
	draw_rect(Rect2(-2, -4, 4, 18), Color("#9e3030"))
	draw_rect(Rect2(-9, 20, 7, 9), Color("#22242b"))
	draw_rect(Rect2(2, 20, 7, 9), Color("#22242b"))
	var eye := facing * 4.0
	draw_circle(Vector2(eye.x - 3, -15 + eye.y * 0.25), 1.2, Color("#2c211c"))
	draw_circle(Vector2(eye.x + 3, -15 + eye.y * 0.25), 1.2, Color("#2c211c"))

func _cardinal(direction: Vector2) -> Vector2:
	if abs(direction.x) > abs(direction.y):
		return Vector2.RIGHT if direction.x > 0 else Vector2.LEFT
	return Vector2.DOWN if direction.y > 0 else Vector2.UP
