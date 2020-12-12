// Timescape (Hard)
//
// made by HSDN

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
	},

	// Boss 1 (phase 1)
	"s-456-401-104-0": [
		{"type": "text", "sub_type": "message", "message": "Bomb"},
		{"type": "text", "sub_type": "message", "message": "(1)", "delay": 550 },
		{"type": "text", "sub_type": "message", "message": "(2)", "delay": 1300 },
		{"type": "text", "sub_type": "message", "message": "(3)", "delay": 2050 },
		{"type": "text", "sub_type": "message", "message": "(4) Dodge!", "delay": 2800 }
	],
	"s-456-1001-107-0": [{ "type": "text", "sub_type": "message", "message": "Shot"}],

		// Boss 1 (phase 2)
		"s-456-413-104-0": "s-456-401-104-0",
		"s-456-414-104-0": "s-456-401-104-0",
		"s-456-415-104-0": "s-456-401-104-0",
		"s-456-416-104-0": "s-456-401-104-0",
		"s-456-1000-107-0": [{ "type": "text", "sub_type": "message", "message": "Shot"}],
		"ab-456-1000-905685": [
			{ "type": "text", "sub_type": "message", "message": "Plague/Regress"}
		],

		// Boss 2
		"s-456-1002-102-0": [{ "type": "text", "sub_type": "message", "message": "Jump"}],
		"s-456-1002-103-0": [{ "type": "text", "sub_type": "message", "message": "Combo"}],
		"s-456-1002-104-0": [{ "type": "text", "sub_type": "message", "message": "Shot (target)"}],
		"s-456-1002-107-0": [{ "type": "text", "sub_type": "message", "message": "Many Pokes"}],
		"s-456-1002-110-0": [{ "type": "text", "sub_type": "message", "message": "Clap"}],
		"s-456-1002-3110-0": [{ "type": "text", "sub_type": "message", "message": "Breath"}],
		"s-456-1002-3113-0": [{ "type": "text", "sub_type": "message", "message": "AOE", "delay": 4000 }],

		// Boss 3
		"ab-456-1003-905607": [
			{ "type": "text", "sub_type": "message", "message": "Cleanse + Plague/Regress"}
		],
		"s-456-1003-103-0": [{ "type": "text", "sub_type": "message", "message": "Spin"}],
		"s-456-1003-104-0": [{ "type": "text", "sub_type": "message", "message": "Clap"}],
		"s-456-1003-105-0": [{ "type": "text", "sub_type": "message", "message": "Front"}],
		"s-456-1003-105-1": [{ "type": "text", "sub_type": "message", "message": "Back"}],
		"s-456-1003-107-0": [{ "type": "text", "sub_type": "message", "message": "Swipe"}],
		"s-456-1003-108-0": [{ "type": "text", "sub_type": "message", "message": "Swipe"}],
		"s-456-1003-109-0": [{ "type": "text", "sub_type": "message", "message": "Breath (target)"}],
		"s-456-1003-111-0": [{ "type": "text", "sub_type": "message", "message": "Leash (target)"}],
		"s-456-1003-3104-0": [{ "type": "text", "sub_type": "message", "message": "Cage"}], // 456016
		"s-456-1003-3108-0": [{ "type": "text", "sub_type": "message", "message": "Waves"}],
		"qb-456-1003-456015": [{ "type": "text", "sub_type": "message", "message": "AOE"}], // 3103
		"qb-456-1003-456017": [{ "type": "text", "sub_type": "message", "message": "Give Stun" }], // 3102
		"dm-0-0-905624": [{ "type": "text", "sub_type": "message", "message": "Wall Change", "delay": 1000 }],
		"dm-0-0-905625": [{ "type": "text", "sub_type": "message", "message": "Wall Change", "delay": 1000 }],
		"dm-0-0-905626": [{ "type": "text", "sub_type": "message", "message": "Wall Change", "delay": 1000 }]
};