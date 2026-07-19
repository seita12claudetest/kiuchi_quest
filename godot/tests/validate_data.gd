extends SceneTree

func _init() -> void:
	var file := FileAccess.open("res://data/maps.json", FileAccess.READ)
	if file == null:
		fail("maps.json could not be opened")
		return
	var maps: Variant = JSON.parse_string(file.get_as_text())
	if not maps is Dictionary:
		fail("maps.json root must be a dictionary")
		return
	var errors: Array[String] = []
	for map_id: String in maps:
		var map: Dictionary = maps[map_id]
		var spawn_ids: Array[String] = []
		for spawn in map.get("spawns", []):
			spawn_ids.append(spawn["id"])
		for portal in map.get("portals", []):
			var target: String = portal.get("to_map", "")
			if not maps.has(target):
				errors.append("%s/%s targets missing map %s" % [map_id, portal.get("id", "?"), target])
				continue
			var target_spawns: Array[String] = []
			for spawn in maps[target].get("spawns", []):
				target_spawns.append(spawn["id"])
			if portal.get("to_spawn", "") not in target_spawns:
				errors.append("%s/%s targets missing spawn %s/%s" % [map_id, portal.get("id", "?"), target, portal.get("to_spawn", "")])
			var return_found := false
			for return_portal in maps[target].get("portals", []):
				if return_portal.get("to_map", "") == map_id:
					return_found = true
					break
			if not return_found:
				errors.append("%s/%s has no return portal from %s" % [map_id, portal.get("id", "?"), target])
		if map.get("interactions", []).size() < 1:
			errors.append("%s has no interactions" % map_id)
	if errors.is_empty():
		print("VALID: %d connected maps" % maps.size())
		quit(0)
	else:
		for error in errors:
			push_error(error)
		quit(1)

func fail(message: String) -> void:
	push_error(message)
	quit(1)
