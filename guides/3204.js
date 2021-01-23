//Cruel Lumikan's Dream (Hard)

let player, entity, library, effect;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
    },

	"qb-3204-1000-32042000": [{ "type": "text", "sub_type": "message", "message": "Arrows", "message_RU": "" }],
	"h-3204-1000-35": [{ "type": "text", "sub_type": "message", "message": "35%", "message_RU": "35%" }],

	"s-3204-1000-104-0": [{ "type": "text", "sub_type": "message", "message": "Stun (AOE)", "message_RU": "" }],
	"s-3204-1000-107-0": [{ "type": "text", "sub_type": "message", "message": "Line Forward + Side Lines", "message_RU": "" }],
	"s-3204-1000-110-0": [{ "type": "text", "sub_type": "message", "message": "Target + Wave", "message_RU": "" }],
	"s-3204-1000-112-0": [{ "type": "text", "sub_type": "message", "message": "Wave Forward", "message_RU": " " }],
	"s-3204-1000-114-0": [{ "type": "text", "sub_type": "message", "message": "Inner + Outer AOEs", "message_RU": "" }],
	"s-3204-1000-116-0": [{ "type": "text", "sub_type": "message", "message": "Line Forward", "message_RU": " " }],
	"s-3204-1000-119-0": [{ "type": "text", "sub_type": "message", "message": "Two Strikes", "message_RU": "" }],
	"s-3204-1000-120-0": [{ "type": "text", "sub_type": "message", "message": "Two Strikes + Stun (AOE)", "message_RU": "" }],
	"s-3204-1000-123-0": [{ "type": "text", "sub_type": "message", "message": "Spin", "message_RU": "" }],
	"s-3204-1000-125-0": [{ "type": "text", "sub_type": "message", "message": "Strun (Tank)", "message_RU": "" }],
	"s-3204-1000-127-0": [{ "type": "text", "sub_type": "message", "message": "Pizza", "message_RU": "" }],
	"s-3204-1000-128-0": [{ "type": "text", "sub_type": "message", "message": "Pizza", "message_RU": "" }],
	"s-3204-1000-148-0": [{ "type": "text", "sub_type": "message", "message": "Pizza", "message_RU": "" }],
	"s-3204-1000-156-0": [{ "type": "text", "sub_type": "message", "message": "Get Skulls", "message_RU": "" }],
	"s-3204-1000-157-0": [{ "type": "text", "sub_type": "message", "message": "Gather!", "message_RU": "", "delay": 5000 }],
	"s-3204-1000-158-0": [{ "type": "text", "sub_type": "message", "message": "Gather!", "message_RU": "", "delay": 5000 }],
	"s-3204-1000-159-0": [{ "type": "text", "sub_type": "message", "message": "AOE", "message_RU": "" }]

}