// Draakon  Arena (Hard)
// WIP
// made by ?_?

let player, entity, library, effect;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
    },

	//RESS Bait //Range Check
	"s-3202-1000-107-0": [{"type": "text","sub_type": "message","message": 'Spectral Throw',"message_RU": ""}],

	//Basic Attacks
	"s-3202-1000-103-0": [{"type": "text","sub_type": "message","message": '2Hits>Bleed',"message_RU": ""}],
	"s-3202-1000-113-0": [{"type": "text","sub_type": "message","message": '4 Hits Combo',"message_RU": ""}],
	"s-3202-1000-105-0": [{"type": "text","sub_type": "message","message": 'Uppercut>Stun(INC)',"message_RU": ""}],
	"s-3202-1000-106-0": [{"type": "text","sub_type": "message","message": 'Stun',"message_RU": ""}],

	"s-3202-1000-120-0": [{"type": "text","sub_type": "message","message": 'Many Pokes>Stun',"message_RU": ""}],
	"s-3202-1000-114-0": [{"type": "text","sub_type": "message","message": 'Stun(AOE)',"message_RU": ""}],
	
	//Leap
	"s-3202-1000-111-0": [{"type": "text","sub_type": "message","message": 'Leap(Stun)',"message_RU": ""}],

	"s-3202-1000-115-0": [{"type": "text","sub_type": "message","message": 'AOE Bombs(SPREAD IF NO NINJA)',"message_RU": ""},
						 {"type": "text","sub_type": "message","delay": 3000,"message": 'Gather!',"message_RU": ""}],

    "s-3202-1000-112-0": [{"type": "text","sub_type": "message","message": 'Front-Back Kick',"message_RU": ""}],

    "s-3202-1000-110-0": [{"type": "text","sub_type": "message","message": 'Jump(In-out-wave)',"message_RU": ""}],

	"s-3202-1000-109-0": [{"type": "text","sub_type": "message","message": 'Knockdown-Spin',"message_RU": ""}],
	
	"s-3202-1000-304-0": [{"type": "text","sub_type": "message","message": 'Shield!',"message_RU": ""}],
	"ab-3202-1000-32021006": [{"type": "text","sub_type": "message","message": 'Plague/Regress',"message_RU": ""}],

    //Pizza Boi
	"s-3202-1000-121-0": [{"type": "text","sub_type": "message","message": 'Right Foot - incoming Stomp (IN>OUT WAVES)',"message_RU": ""},
						 //LEFT MARKERS
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,245,400,0,4000)},
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,305,400,0,4000)},
						 //RIGHT MARKERS
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,65,400,0,4000)},
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,125,400,0,4000)},
						 {"type": "text","sub_type": "message","delay": 1900,"message": 'Dodge!',"message_RU": ""}],
    "s-3202-1000-122-0": [{"type": "text","sub_type": "message","message": 'Front-back pizza',"message_RU": ""},
						 {"type": "func","func": SpawnItem.bind(null,89544,0,200,100,4000)}],
	"s-3202-1000-123-0": [{"type": "text","sub_type": "message","message": 'Back pizza',"message_RU": ""},
						 {"type": "text","sub_type": "message","delay":100,"message": 'IN>OUT WAVES',"message_RU": ""}],

	"s-3202-1000-127-0": [{"type": "text","sub_type": "message","message": '(IN>OUT WAVES)',"message_RU": ""},
						 {"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,157,0,5000)},
						 {"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,307,0,5000)}],				 

	"s-3202-1000-124-0": [{"type": "text","sub_type": "message","message": 'Left Foot - incoming Stomp (OUT>IN WAVES)',"message_RU": ""},
						//LEFT MARKERS
						{"type": "func","func": SpawnVector.bind(null,912,0,0,245,400,0,4000)},
						{"type": "func","func": SpawnVector.bind(null,912,0,0,305,400,0,4000)},
						//RIGHT MARKERS
						{"type": "func","func": SpawnVector.bind(null,912,0,0,65,400,0,4000)},
						{"type": "func","func": SpawnVector.bind(null,912,0,0,125,400,0,4000)},
						 {"type": "text","sub_type": "message","delay": 1900,"message": 'Dodge!',"message_RU": ""}],
    "s-3202-1000-125-0": [{"type": "text","sub_type": "message","message": 'Front-back pizza',"message_RU": ""},
	  					 {"type": "func","func": SpawnItem.bind(null,89544,0,200,100,4000)}],
	"s-3202-1000-126-0": [{"type": "text","sub_type": "message","message": 'Back pizza',"message_RU": ""},
						{"type": "text","sub_type": "message","delay":100,"message": 'OUT>IN WAVES',"message_RU": ""}],
						//128
	"s-3202-1000-128-0": [{"type": "text","sub_type": "message","message": '(OUT>IN WAVES)',"message_RU": ""},
						 {"type": "func","func": SpawnCircle.bind(null,false,445,0,0,18,143,0,5000)},
						 {"type": "func","func": SpawnCircle.bind(null,false,445,0,0,12,293,0,5000)}]
};