// Draakon  Arena (Normal)
//
// made by ?_?

let player, entity, library, effect;

const {HIGHLIGHT_ITEM, SpawnItem, SpawnMarker, SpawnVector, SpawnCircle} = require("../lib");

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
    },

	//RESS Bait //Range Check
	"s-3102-1000-107-0": [{"type": "text","sub_type": "message","message": 'Spectral Throw',"message_RU": ""}],

	//Basic Attacks
	"s-3102-1000-103-0": [{"type": "text","sub_type": "message","message": '2Hits>Bleed',"message_RU": ""}],
	"s-3102-1000-113-0": [{"type": "text","sub_type": "message","message": '4 Hits Combo',"message_RU": ""}],
	"s-3102-1000-104-0": [{"type": "text","sub_type": "message","message": 'Uppercut>Stun(INC)',"message_RU": ""}],
	"s-3102-1000-106-0": [{"type": "text","sub_type": "message","message": 'Stun',"message_RU": ""}],

	"s-3102-1000-120-0": [{"type": "text","sub_type": "message","message": 'Many Pokes>Stun',"message_RU": ""}],
	"s-3102-1000-114-0": [{"type": "text","sub_type": "message","message": 'Stun(AOE)',"message_RU": ""}],
	
	//Leap
	"s-3102-1000-111-0": [{"type": "text","sub_type": "message","message": 'Leap(Stun)',"message_RU": ""}],

	"s-3102-1000-115-0": [{"type": "text","sub_type": "message","message": 'AOE Bombs(SPREAD IF NO NINJA)',"message_RU": ""},
						 {"type": "text","sub_type": "message","delay": 3000,"message": 'Gather!',"message_RU": ""}],

    "s-3102-1000-112-0": [{"type": "text","sub_type": "message","message": 'Front-Back Kick',"message_RU": ""}],

    "s-3102-1000-110-0": [{"type": "text","sub_type": "message","message": 'Jump(In-out-wave)',"message_RU": ""}],

	"s-3102-1000-109-0": [{"type": "text","sub_type": "message","message": 'Knockdown-Spin',"message_RU": ""}],
	
	"s-3102-1000-304-0": [{"type": "text","sub_type": "message","message": 'Shield!',"message_RU": ""}],

    //Pizza Boi
	"s-3102-1000-121-0": [{"type": "text","sub_type": "message","message": 'Right Foot - incoming Stomp',"message_RU": ""},
						 //LEFT MARKERS
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,245,400,0,4000)},
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,305,400,0,4000)},
						 //RIGHT MARKERS
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,65,400,0,4000)},
						 {"type": "func","func": SpawnVector.bind(null,912,0,0,125,400,0,4000)},
						 {"type": "text","sub_type": "message","delay": 1900,"message": 'Dodge!',"message_RU": ""}],
    "s-3102-1000-122-0": [{"type": "text","sub_type": "message","message": 'Front-back pizza',"message_RU": ""}],
    "s-3102-1000-123-0": [{"type": "text","sub_type": "message","message": 'Back pizza',"message_RU": ""}],

	"s-3102-1000-124-0": [{"type": "text","sub_type": "message","message": 'Left Foot - incoming Stomp',"message_RU": ""},
						//LEFT MARKERS
						{"type": "func","func": SpawnVector.bind(null,912,0,0,245,400,0,4000)},
						{"type": "func","func": SpawnVector.bind(null,912,0,0,305,400,0,4000)},
						//RIGHT MARKERS
						{"type": "func","func": SpawnVector.bind(null,912,0,0,65,400,0,4000)},
						{"type": "func","func": SpawnVector.bind(null,912,0,0,125,400,0,4000)},
						 {"type": "text","sub_type": "message","delay": 1900,"message": 'Dodge!',"message_RU": ""}],
    "s-3102-1000-125-0": [{"type": "text","sub_type": "message","message": 'Front-back pizza',"message_RU": ""}],
	"s-3102-1000-126-0": [{"type": "text","sub_type": "message","message": 'Back pizza',"message_RU": ""}],
	
	"s-3102-1000-304-0": [{"type": "text","sub_type": "message","message": 'Shield!',"message_RU": ""}]

	// "s-467-46703-213-0": [{"type": "text","sub_type": "message","message": 'Back attack',"message_RU": "Задняя"}],
	// "s-467-46704-205-0": [{"type": "text","sub_type": "message","delay":2500,"message":  'Pushback',"message_RU": "Откид"}],
	// //"s-467-46704-206-0": [{"type": "text","sub_type": "message","message": '206',"message_RU": "206"}],
	// //"s-467-46704-207-0": [{"type": "text","sub_type": "message","message": '207',"message_RU": "207"}],

	// "s-467-46704-208-0": [{"type": "text","sub_type": "message","message": 'Laser',"message_RU": "Лазер"},
	// 					  {"type": "text","sub_type": "message","delay": 13000,"message": 'Pushback',"message_RU": "Откид"}
	// ],
	// "s-467-46704-209-0": [{"type": "text","sub_type": "message","message": 'Attack to tank',"message_RU": "Удар в танка"}],
	// "s-467-46704-210-0": [{"type": "text","sub_type": "message","message": 'Laser',"message_RU": "Лазер"},
	// 					  {"type": "text","sub_type": "message","delay": 21000,"message": 'Pushback - Iframe',"message_RU": "Откид"}
	// ],
	// "s-467-46704-211-0": [{"type": "text","sub_type": "message","message": 'Wave',"message_RU": "Одна волна"},
	// 					  {"type": "text","sub_type": "message","delay": 3000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// ],
	// "s-467-46704-212-0": [{"type": "text","sub_type": "message","message": 'Waves',"message_RU": "Волны"},
	// 					  {"type": "text","sub_type": "message","delay": 3000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// ],
	// "s-467-46704-213-0": [{"type": "text","sub_type": "message","message": 'Circles',"message_RU": "Круги!!"},
	// 					  {"type": "text","sub_type": "message","delay": 1000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// 					  //{"type": "text","sub_type": "message","delay": 4000,"message": 'Along',"message_RU": "На месте"}
	// ],
	// "s-467-46704-214-0": [{"type": "text","sub_type": "message","message": 'Circles',"message_RU": "Круги!!"},
	// 					  {"type": "text","sub_type": "message","delay": 1000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// 					  //{"type": "text","sub_type": "message","delay": 4000,"message": 'Reverse',"message_RU": "Обратно"}
	// ],
	// "s-467-46704-215-0": [{"type": "text","sub_type": "message","message": 'Circles',"message_RU": "Круги!"},
	// 					  {"type": "text","sub_type": "message","delay": 1000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// ],
	// "s-467-46704-216-0": [{"type": "text","sub_type": "message","message": 'Circles',"message_RU": "Круги!!"},
	// 					  {"type": "text","sub_type": "message","delay": 1000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// ],
	// "s-467-46704-217-0": [{"type": "text","sub_type": "message","message": 'Circles',"message_RU": "Круги!!"},
	// 					  {"type": "text","sub_type": "message","delay": 1000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// ],
	// "s-467-46704-219-0": [{"type": "text","sub_type": "message","message": 'Two waves',"message_RU": "Две волны"},
	// 					  {"type": "text","sub_type": "message","delay": 3000,"message": 'Dodge',"message_RU": "Эвейд!"}
	// ]
};