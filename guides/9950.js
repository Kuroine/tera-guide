// Harrowhold
// WIP
// 

let player, entity, library, effect;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

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
	//"s-950-3001-206-0": [{"type": "text","sub_type": "message","message": 'Blood Wall(Left)',"message_RU": ""}]
	//dm-0-0-9950040
	//s-950-4104-111-0 Right blood wall

	"s-950-3000-106-0": [{"type": "text","sub_type": "message","message": 'Hakan',"message_RU": ""}],
	"s-950-3000-111-0": [{"type": "text","sub_type": "message","message": 'Debuff',"message_RU": ""}],
	"s-950-3000-137-0": [{"type": "text","sub_type": "message","message": 'Left Swipe',"message_RU": ""}],
	"s-950-3000-136-0": [{"type": "text","sub_type": "message","message": 'Right Swipe',"message_RU": ""}],
	"s-950-3000-110-0": [{"type": "text","sub_type": "message","message": 'Fire Breath(Left)',"message_RU": ""}],
	"s-950-3000-108-0": [{"type": "text","sub_type": "message","message": 'Gather(Tank Block)',"message_RU": ""}],
	"s-950-3016-133-0": [{"type": "text","sub_type": "message","message": 'Red/Orange Orb',"message_RU": ""}],
	"s-950-3017-134-0": [{"type": "text","sub_type": "message","message": 'Black Orb',"message_RU": ""}]
};
