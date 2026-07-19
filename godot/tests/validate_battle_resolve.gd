extends SceneTree

const BattleMath := preload("res://scripts/battle_math.gd")

func _with(base: Dictionary, overrides: Dictionary) -> Dictionary:
	var result: Dictionary = base.duplicate()
	for key in overrides:
		result[key] = overrides[key]
	return result

func _init() -> void:
	var errors: Array[String] = []
	var base_context := {
		"expertise": 20, "trust": 3, "focus": 40, "battle_mode": "normal",
		"met_tanaka": true, "checked_ledger": true, "interviewed_accounting": false,
		"root_cause_found": false, "fatigue_active": false, "evidence_passive_active": false,
	}

	var expected_organize_damage: int = 12 + 20 / 10
	var organize: Dictionary = BattleMath.resolve_action("organize", base_context)
	if int(organize["damage"]) != expected_organize_damage:
		errors.append("organize damage expected %d, got %d" % [expected_organize_damage, organize["damage"]])

	var organize_passive: Dictionary = BattleMath.resolve_action("organize", _with(base_context, {"evidence_passive_active": true}))
	if int(organize_passive["damage"]) != expected_organize_damage + 3:
		errors.append("organize with passive expected %d, got %d" % [expected_organize_damage + 3, organize_passive["damage"]])

	var organize_fatigued: Dictionary = BattleMath.resolve_action("organize", _with(base_context, {"fatigue_active": true}))
	var expected_fatigued: int = maxi(0, expected_organize_damage - 6)
	if int(organize_fatigued["damage"]) != expected_fatigued:
		errors.append("organize with fatigue expected %d, got %d" % [expected_fatigued, organize_fatigued["damage"]])
	if not String(organize_fatigued["log_text"]).contains("疲労"):
		errors.append("organize with fatigue should mention fatigue in log text")

	var network_fatigued: Dictionary = BattleMath.resolve_action("network", _with(base_context, {"fatigue_active": true}))
	if int(network_fatigued["damage"]) != 16 + 3:
		errors.append("network should be unaffected by fatigue (talking, not analysis)")

	var guard: Dictionary = BattleMath.resolve_action("guard", base_context)
	if not bool(guard["guard"]):
		errors.append("guard should set guard=true")
	if int(guard["new_focus"]) != mini(40, int(base_context["focus"]) + 12):
		errors.append("guard focus mismatch")

	var network_no_tanaka: Dictionary = BattleMath.resolve_action("network", _with(base_context, {"met_tanaka": false}))
	if int(network_no_tanaka["damage"]) != 0:
		errors.append("network without tanaka should deal 0 damage")

	var technique_low_focus: Dictionary = BattleMath.resolve_action("technique", _with(base_context, {"focus": 5}))
	if int(technique_low_focus["damage"]) != 0 or int(technique_low_focus["new_focus"]) != 5:
		errors.append("technique with insufficient focus should deal 0 damage and not spend focus")

	if errors.is_empty():
		print("VALID: battle resolve_action")
		quit(0)
	else:
		for error in errors:
			push_error(error)
		quit(1)
