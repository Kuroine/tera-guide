// Harrowhold
// WIP
// 

let player, entity, library, effect;

let spawn_orb = false, seventy_percent = false;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

function seventy(){
	seventy_percent = true;
}

function print_orb(handlers) {
	spawn_orb = !spawn_orb;

	if (spawn_orb) {
		handlers['text']({
			"sub_type": "message",
			"message": "Debuff(Orb)",
			"message_RU": ""
		});
	}
	else{
		handlers['text']({
			"sub_type": "message",
			"message": "Debuff",
			"message_RU": ""
		});
	}
}

function print_seventy(handlers) {
	if (seventy_percent) {
		handlers['text']({
			"sub_type": "message",
			"message": "4 Elemental(Orb After)",
			"message_RU": ""
		});
	}
	else{
		handlers['text']({
			"sub_type": "message",
			"message": "2 Elemental",
			"message_RU": ""
		});
	}
}

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
	},
	

	//Phase 2
	"s-950-1000-102-0": [{"type": "text","sub_type": "message","message": 'Triple Paw',"message_RU": ""}],
	"s-950-1000-101-0": [{"type": "text","sub_type": "message","message": 'Bite',"message_RU": ""}],
	"s-950-1000-131-0": [{"type": "text","sub_type": "message","message": 'Jump',"message_RU": ""}],
	"s-950-1000-132-0": [{"type": "text","sub_type": "message","message": 'Jump',"message_RU": ""}],
	"s-950-1000-106-0": [{"type": "text","sub_type": "message","message": 'Headbutt',"message_RU": ""}],

	"s-950-1000-129-0": [{"type": "text","sub_type": "message","message": 'Fire Breath(Left)',"message_RU": ""}],
	"s-950-1000-114-0": [{"type": "text","sub_type": "message","message": 'Fire Breath(Right)',"message_RU": ""}],
	"s-950-1000-502-0": [{"type": "text","sub_type": "message","message": 'Run Out',"message_RU": ""}],
	"s-950-1000-503-0": [{"type": "text","sub_type": "message","message": 'Stay Out',"message_RU": ""}],

	//Phase 3
	
	//Blood Announcement
	//dm-0-0-9950040

	//Black Orb pulse
	//s-950-3021-206-0

	//Basic attacks
	//Left paw
	//3000-102-0
	//Right paw
	//3000-101-0

	//h-950-3000-70
	"h-950-3000-70": [{"type": "func","func": seventy}],
	//dm-0-0-9950060
	"dm-0-0-9950060": [{"type": "func","func": print_seventy}],

	//Left blood
	//s-950-3005-206-0 
	"s-950-3005-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Left)',"message_RU": ""}],
	//s-950-3001-206-0
	"s-950-3001-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Left)',"message_RU": ""}],

	//Right blood
	//s-950-3002-206-0
	"s-950-3002-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Right)',"message_RU": ""}],
	//s-950-3006-206-0
	"s-950-3006-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Right)',"message_RU": ""}],

	//Front Blood
	//3105-206-0
	"s-950-3105-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Front)',"message_RU": ""}],
	//3107-206-0
	"s-950-3107-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Front)',"message_RU": ""}],

	//Back Blood
	//3106-206-0
	"s-950-3106-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Back)',"message_RU": ""}],
	//3108-206-0
	"s-950-3108-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Back)',"message_RU": ""}],
	
	//Back Blood Center Safe
	//3104-206-0
	"s-950-3104-206-0": [{"type": "text","sub_type": "message","message": 'Big Blood Wall(Back)',"message_RU": ""}],

	//Left Elemental
	//s-950-3007-206-0
	"s-950-3007-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Left)',"message_RU": ""}],
	//s-950-3008-206-0
	"s-950-3008-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Left)',"message_RU": ""}],

	//Right Elemental
	//s-950-3009-206-0
	"s-950-3009-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Right)',"message_RU": ""}],
	//s-950-3010-206-0
	"s-950-3010-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Right)',"message_RU": ""}],

	//Front Elemental
	//s-950-3109-206-0
	"s-950-3109-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Front)',"message_RU": ""}],
	//s-950-3110-206-0
	"s-950-3110-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Front)',"message_RU": ""}],

	//Back Elemental
	//s-950-3111-206-0
	"s-950-3111-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Back)',"message_RU": ""}],
	//s-950-3112-206-0	
	"s-950-3112-206-0": [{"type": "text","sub_type": "message","message": 'Elemental(Back)',"message_RU": ""}],
	
	
	

	//Black Left Red/Orange Right
	//s-950-3000-134-0
	//Double orb after
	"s-950-3000-134-0": [{"type": "text","sub_type": "message","message": 'Black-LEFT/Red-RIGHT (ORB)',"message_RU": ""}],
	"s-950-3000-135-0": [{"type": "text","sub_type": "message","message": 'Black-RIGHT/Red-LEFT (ORB)',"message_RU": ""}],

	"s-950-3000-106-0": [{"type": "text","sub_type": "message","message": 'Hakan',"message_RU": ""}],

	"s-950-3000-111-0": [{"type": "func","func": print_orb}],	
	//"s-950-3000-111-0": [{"type": "text","sub_type": "message","message": 'Debuff',"message_RU": ""}],
	

	"s-950-3000-137-0": [{"type": "text","sub_type": "message","message": 'Left Swipe',"message_RU": ""}],
	"s-950-3000-136-0": [{"type": "text","sub_type": "message","message": 'Right Swipe',"message_RU": ""}],
	"s-950-3000-110-0": [{"type": "text","sub_type": "message","message": 'Fire Breath(Left)',"message_RU": ""}],
	"s-950-3000-109-0": [{"type": "text","sub_type": "message","message": 'Fire Breath(Right)',"message_RU": ""}],
	"s-950-3000-108-0": [{"type": "text","sub_type": "message","message": 'Gather(Tank Block)',"message_RU": ""}],
	"s-950-3016-133-0": [{"type": "text","sub_type": "message","message": 'Red/Orange Orb(Center)',"message_RU": ""}],
	"s-950-3017-134-0": [{"type": "text","sub_type": "message","message": 'Black Orb(Center)',"message_RU": ""}],
	"s-950-3014-133-0": [{"type": "text","sub_type": "message","message": 'Red/Orange Orb',"message_RU": ""}],
	"s-950-3015-134-0": [{"type": "text","sub_type": "message","message": 'Black Orb',"message_RU": ""}]
};
