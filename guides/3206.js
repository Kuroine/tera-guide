//Crimson Killing Grounds

let player, entity, library, effect;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

let combo_start = false;


function combo_checker(){
	combo_start = true;
	setTimeout(() => combo_start = false, 1400);
}
function combo_cont(handlers) {
	if (combo_start == true) {
		handlers['text']({
			"sub_type": "message",
			"message": "Knockback SPIN INC(KAIA)",
			"message_RU": ""
		});
	}
}


module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
    },

	"h-3206-1000-100": [
		{"type": "func","func": SpawnVector.bind(null,553,0,-100,183,800,100,60000000)},
	],

	//102 - 105 - 106 Combo

	"s-3206-1000-102-0": [{"type": "func","func": combo_checker}],
	"s-3206-1000-105-0": [{"type": "func","func": combo_cont}],


	//1min 20 donut

	"s-3206-1000-106-0": [{ "type": "text", "sub_type": "message", "message": "Knockback Spin", "message_RU": "" }],


	//513 stomp indicator?
	//"s-3206-1000-513-0": [{ "type": "text", "sub_type": "message", "message": "Stomp INCOMING", "message_RU": "" }],
	//"s-3206-1000-514-0": [{ "type": "text", "sub_type": "message", "message": "Stomp INCOMING", "message_RU": "" }],

	"s-3206-1000-209-0": [{ "type": "text", "sub_type": "message", "message": "Stomp(STUN HIM)", "message_RU": "" }],
	"s-3206-1000-210-0": [{ "type": "text", "sub_type": "message", "message": "Stomp(STUN HIM)", "message_RU": "" }],
	"s-3206-1000-508-0": [{ "type": "text", "sub_type": "message", "message": "Red(IN-OUT)", "message_RU": "" },
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,2500)},
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,1500)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,157,1500,5000)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,307,1500,5000)}],
	"s-3206-1000-509-0": [{ "type": "text", "sub_type": "message", "message": "Blue(OUT-IN)", "message_RU": "" },
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,2500)},
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,1500)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,143,1500,5000)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,293,1500,5000)}],

	"s-3206-1000-516-0": [{ "type": "text", "sub_type": "message", "message": "Fast Red(IN-OUT)", "message_RU": "" },
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,2500)},
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,1500)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,157,1500,5000)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,307,1500,5000)}],
	"s-3206-1000-517-0": [{ "type": "text", "sub_type": "message", "message": "Fast Blue(OUT-IN)", "message_RU": "" },
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,2500)},
	//{"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,1500)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,143,1500,5000)},
	{"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,293,1500,5000)}],

	//Over There
	"qb-3206-1000-32061001": [{ "type": "text", "sub_type": "message", "message": "Debuff(Close)", "message_RU": "" }], 
	//Back There
	"qb-3206-1000-32061002": [{ "type": "text", "sub_type": "message", "message": "Debuff(Furthest)", "message_RU": "" }]

}