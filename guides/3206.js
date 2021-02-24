//Crimson Killing Grounds

let player, entity, library, effect;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
    },


	//Over There
	"qb-3206-1000-32061001": [{ "type": "text", "sub_type": "message", "message": "Debuff(Close)", "message_RU": "" }], 
	//Back There
	"qb-3206-1000-32061002": [{ "type": "text", "sub_type": "message", "message": "Debuff(Furthest)", "message_RU": "" }]

	//upward slash (1 hit)

	//Cross Slash/Twin Stab (2 hit)

	//Downward Slash (1 hit) (Chain Starter)

	// "qb-3104-1000-32042000": [{ "type": "text", "sub_type": "message", "message": "Arrows", "message_RU": "" }],
	// //"h-3104-1000-35": [{ "type": "text", "sub_type": "message", "message": "35%", "message_RU": "35%" }],

	// "s-3104-1000-104-0": [{ "type": "text", "sub_type": "message", "message": "Stun (AOE)", "message_RU": "" },
	// { "type": "func", "func": SpawnCircle.bind(null, false, 553, 180, -50, 10, 380, 0, 2000) },
	// ],
	// "s-3104-1000-107-0": [{ "type": "text", "sub_type": "message", "message": "Line Forward + Side Lines", "message_RU": "" }],
	// "s-3104-1000-110-0": [{ "type": "text", "sub_type": "message", "message": "Target + Wave", "message_RU": "" }],
	// "s-3104-1000-112-0": [{ "type": "text", "sub_type": "message", "message": "Wave Forward", "message_RU": " " }],
	// "s-3104-1000-114-0": [{ "type": "text", "sub_type": "message", "message": "Inner + Outer AOEs", "message_RU": "" }],
	// "s-3104-1000-116-0": [{ "type": "text", "sub_type": "message", "message": "Line Forward", "message_RU": " " }],
	// "s-3104-1000-119-0": [{ "type": "text", "sub_type": "message", "message": "Two Strikes", "message_RU": "" }],
	// "s-3104-1000-120-0": [{ "type": "text", "sub_type": "message", "message": "Two Strikes + Stun (AOE)", "message_RU": "" }],
	// "s-3104-1000-123-0": [{ "type": "text", "sub_type": "message", "message": "Spin", "message_RU": "" }],
	// "s-3104-1000-125-0": [{ "type": "text", "sub_type": "message", "message": "Stun (Tank)", "message_RU": "" }],
	// "s-3104-1000-127-0": [{ "type": "text", "sub_type": "message", "message": "Pizza", "message_RU": "" }],
	// "s-3104-1000-128-0": [{ "type": "text", "sub_type": "message", "message": "Pizza", "message_RU": "" }],
	// "s-3104-1000-148-0": [{ "type": "text", "sub_type": "message", "message": "Pizza", "message_RU": "" }],
	// "s-3104-1000-156-0": [{ "type": "text", "sub_type": "message", "message": "Get Skulls", "message_RU": "" }],
	// "s-3104-1000-157-0": [{ "type": "text", "sub_type": "message", "message": "Gather!", "message_RU": "", "delay": 5000 }],
	// "s-3104-1000-158-0": [{ "type": "text", "sub_type": "message", "message": "Gather!", "message_RU": "", "delay": 5000 }],
	// "s-3104-1000-159-0": [{ "type": "text", "sub_type": "message", "message": "AOE", "message_RU": "" }]



}