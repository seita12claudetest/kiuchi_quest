extends SceneTree

const GameStateScript := preload("res://scripts/game_state.gd")

func _init() -> void:
	var state: Node = GameStateScript.new()
	var data := {
		"relationship_npc": "tanaka",
		"dialogue_tiers": [
			{"min": 6, "text": "close", "flags": ["tanaka_close_friend"]},
			{"min": 3, "text": "mid"},
			{"min": 0, "text": "base"},
		],
	}
	var errors: Array[String] = []
	state.relationships["tanaka"] = 0
	if state.dialogue_text(data) != "base":
		errors.append("expected base tier at level 0")
	state.relationships["tanaka"] = 3
	if state.dialogue_text(data) != "mid":
		errors.append("expected mid tier at level 3")
	state.relationships["tanaka"] = 6
	if state.dialogue_text(data) != "close":
		errors.append("expected close tier at level 6")
	if not state.has_flag("tanaka_close_friend"):
		errors.append("expected tanaka_close_friend flag to be set at close tier")
	if state.dialogue_text({"text": "plain"}) != "plain":
		errors.append("expected plain text fallback when no tiers present")
	state.free()
	if errors.is_empty():
		print("VALID: dialogue tier branching")
		quit(0)
	else:
		for error in errors:
			push_error(error)
		quit(1)
