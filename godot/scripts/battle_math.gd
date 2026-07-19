extends RefCounted
class_name BattleMath

const FATIGUE_PENALTY := 6
const EVIDENCE_PASSIVE_BONUS := 3

static func resolve_action(action: String, context: Dictionary) -> Dictionary:
	var expertise: int = context.get("expertise", 0)
	var trust: int = context.get("trust", 0)
	var focus: int = context.get("focus", 0)
	var battle_mode: String = context.get("battle_mode", "normal")
	var met_tanaka: bool = context.get("met_tanaka", false)
	var checked_ledger: bool = context.get("checked_ledger", false)
	var interviewed_accounting: bool = context.get("interviewed_accounting", false)
	var root_cause_found: bool = context.get("root_cause_found", false)
	var fatigue_active: bool = context.get("fatigue_active", false)
	var evidence_passive_active: bool = context.get("evidence_passive_active", false)

	var damage := 0
	var heal := 0
	var new_focus := focus
	var guard := false
	var log_text := ""
	match action:
		"organize":
			damage = 12 + expertise / 10 + (4 if battle_mode == "case" else 0) + (EVIDENCE_PASSIVE_BONUS if evidence_passive_active else 0)
			log_text = "木内は伝票を日付と商品コードで並べ替えた。処理の順序が見えてきた。"
		"technique":
			if focus >= 10:
				new_focus = focus - 10
				damage = 20 + expertise / 5
				log_text = "5250端末の照合手順を思い出し、重複と欠番を切り分けた。"
			else:
				log_text = "集中力が続かず、端末の入力位置を見失った。"
		"network":
			if met_tanaka:
				damage = 16 + trust + (8 if battle_mode == "case" and interviewed_accounting else 0)
				heal = 8
				log_text = "田中が営業側の事情を補足した。曖昧だった伝票の出所が絞られる。"
			else:
				log_text = "相談できる相手がまだいない。"
		"negotiate":
			if checked_ledger:
				damage = 36 if battle_mode == "case" and root_cause_found else 28
				log_text = "台帳との照合結果を根拠に、締め処理の順序変更を提案した。"
			else:
				damage = 5
				log_text = "根拠が足りず、提案は保留になった。"
		"guard":
			guard = true
			new_focus = mini(40, focus + 12)
			log_text = "一度手を止め、優先順位と締め時刻を確認した。"
	if fatigue_active and damage > 0 and action in ["organize", "technique", "negotiate"]:
		damage = maxi(0, damage - FATIGUE_PENALTY)
		log_text += "\n疲労で本来の手際より鈍っている。"
	return {"damage": damage, "heal": heal, "new_focus": new_focus, "log_text": log_text, "guard": guard}
