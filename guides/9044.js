// Bahaar's Sanctum
//
// made by michengs

const {SpawnMarker, SpawnPoint, SpawnVector, SpawnCircle} = require("../lib");

let player, entity, library, effect;
let notice_guide = true;
let shining = false;
let skill = 0;
let print = false;
let notice = true;
let notices = true;
let printend = false;

function skillds_event(skillids, handlers, event, ent, dispatch) {
	if (skillids === 104) {
		skill = 104;
		//setTimeout(() => skill = 0, 500);
			
	} else if (skillids === 134) {
		skill = 134;
		//setTimeout(() => skill = 0, 500);
	} else if (skillids === 118) {
		skill = 118;
		//setTimeout(() => skill = 0, 500);
	}
}

function skilld_event(skillid, handlers, event, ent, dispatch) {
	if (skillid == 90442000) shining = true;
	if (skillid == 90442001) shining = false;
	if (skillid == 90442304) {
		handlers['text']({"sub_type": "message","message": "Stun","message_RU": "Стан!!!"});
		handlers['text']({
			"sub_type": "notification",
			"message": "Stun",
			"message_RU": "Стан!!!"
		});
	}
	if (skillid == 90444001 && skill == 104) {
		setTimeout(() => {
			if (shining){
				handlers['text']({"sub_type": "msgcp","message": "back","message_RU": "Удар назад"}); 
				skill = 0;
				notices = false;
				setTimeout(() => notices = true, 1000);
			}
		}, 500);
	}
	if (skillid == 90442000 && skill == 134) setTimeout(() => {
		if (shining) {
			handlers['text']({"sub_type": "msgcp","message": "back","message_RU": "Удар назад"});
			skill = 0; 
			notices = false;
			setTimeout(() => notices = true, 1000);
		}
	}, 300);
	if (skillid == 90444001 && skill == 118) setTimeout(() => {
		if (shining) {
			handlers['text']({"sub_type": "msgcp","message": "back","message_RU": "Удар назад"});
			skill = 0; 
			notices = false;
			setTimeout(() => notices = true, 1000);
		}
	}, 300);
	if (notice && skillid == 305) {
		notice = false;
		handlers['text']({"sub_type": "message","message": "laser","message_RU": "Лазер !!!"});
		handlers['text']({
			"sub_type": "notification",
			"message": "laser",
			"message_RU": "Лазер !!!"
		});
		setTimeout(() => notice = true, 4000);
	}
	if (notices && skillid == 137) {
		handlers['text']({"sub_type": "message","message": "back","message_RU": "Удар назад"});
	}
}

function start_boss() {
	print = true;
	printend = true;
}

function print_th(handlers) {
	if (print) {
		handlers['text']({
			"sub_type": "message",
			"message": "laser (loading)",
			"message_RU": "Лазер?!!!"
		});
	}
	print = false;
}

function print_end(handlers) {
	if(printend) {
		handlers['text']({
			"sub_type": "message",
			"message": "laser (loading)",
			"message_RU": "Лазер??!!!"
		});
		handlers['text']({
			"sub_type": "message",
			"delay": 30000,
			"message": "laser (loading)",
			"message_RU": "Лазер???!!!"
		});
	}
	printend = false;
}

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
	},
	"h-444-2000-100": [
		//{"type": "func","func": SpawnVector.bind(null,542,0,0,0,3000,0,6000000)},
		//{"type": "func","func": SpawnVector.bind(null,542,0,0,180,3000,0,6000000)}
		{"type": "func","func": SpawnMarker.bind(null,false,0,-700,100,60000000,false,["Throne","Throne direction"])},
		{"type": "func","func": SpawnPoint.bind(null,513,0,800,100,60000000)}
	],
	//构建直线（提示标志 偏移角度 偏移距离  角度 最远距离   时间）

	//"s-444-2000-1104-0": [{"type": "func","func": skillds_event.bind(null, 104)}],
	//"s-444-2000-2104-0": [{"type": "func","func": skillds_event.bind(null, 104)}],
	//"s-444-2000-1134-0": [{"type": "func","func": skillds_event.bind(null, 134)}],
	//"s-444-2000-2134-0": [{"type": "func","func": skillds_event.bind(null, 134)}],

	"s-444-1000-2103-0": [{"type": "text","sub_type": "message","message": "Front (Dodge)","message_RU": "Удар вперед (эвейд)"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,400,8,350,100,3000)}
	],
	"s-444-1000-2108-0": [{"type": "text","sub_type": "message","message": 'Back Throw -> Front',"message_RU": "Стан назад -> Черенок"}],
	"s-444-1000-2111-0": [{"type": "text","sub_type": "message","message": 'Back',"message_RU": "Удар назад --"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-1000-2113-0": [{"type": "text","sub_type": "message","message": 'Throw',"message_RU": "Молот (байт)"}],
	"s-444-1000-2114-0": [{"type": "text","sub_type": "message","message": 'Front Slam',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,260,10,320,100,4000)}
	],
	"s-444-1000-2115-0": [{"type": "text","sub_type": "message","message": 'Knockup',"message_RU": "Черкаш (полет)"}],
	"s-444-1000-2116-0": [{"type": "text","sub_type": "message","message": 'Donuts',"message_RU": "Бублики"},
						  {"type": "func","func": SpawnCircle.bind(null,false,553,0,0,8,290,100,6000)}
	],
	"s-444-1000-2117-0": [{"type": "text","sub_type": "message","message": 'Jump (Bait)',"message_RU": "Прыжок (байт)"}],
	"s-444-1000-2118-0": [{"type": "text","sub_type": "message","message": 'Jump (Tank)',"message_RU": "Прыжок (танк)"}
						  //{"type": "func","func": skillds_event.bind(null, 118)}
	],
	"s-444-1000-2121-0": [{"type": "text","sub_type": "message","message": 'Waves (Left)',"message_RU": "Волны (левая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-1000-2131-0": [{"type": "text","sub_type": "message","message": 'Front -> Left Scratch',"message_RU": "Удар в вперед -> левый черкаш"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,358,340,8,660,100,4000)}
	],
	"s-444-1000-2132-0": [
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,0,500,0,2000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,180,500,0,2000)}
	],
	"s-444-1000-2137-0": [
						  {"type": "text","sub_type": "message","message": 'Hammer back ',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-1000-2138-0": [{"type": "text","sub_type": "message","message": 'Knockup (Bait)',"message_RU": "Черкаш (полет)"}],
	"s-444-1000-2139-0": [{"type": "text","sub_type": "message","message": 'Dodge!!',"message_RU": "Эвейд!!!"}],
	"s-444-1000-2140-0": [{"type": "text","sub_type": "message","message": 'Waves (Right)',"message_RU": "Волны (правая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	//-----------------------------------------------------------------------------------------------------
	"s-444-1000-1103-0": [{"type": "text","sub_type": "message","message": 'Front (Dodge)',"message_RU": "Удар вперед (эвейд)"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,400,8,350,100,3000)}
	],
	"s-444-1000-1108-0": [{"type": "text","sub_type": "message","message": 'Back Throw -> Front',"message_RU": "Стан назад -> Черенок"}],
	"s-444-1000-1111-0": [{"type": "text","sub_type": "message","message": 'Back',"message_RU": "Удар назад --"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-1000-1113-0": [{"type": "text","sub_type": "message","message": 'Throw',"message_RU": "Молот (байт)"}],
	"s-444-1000-1114-0": [{"type": "text","sub_type": "message","message": 'Front Slam',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,260,10,320,100,4000)}
	],
	"s-444-1000-1115-0": [{"type": "text","sub_type": "message","message": 'Knockup',"message_RU": "Черкаш (полет)"}],
	"s-444-1000-1116-0": [{"type": "text","sub_type": "message","message": 'Donuts',"message_RU": "Бублики"},
						  {"type": "func","func": SpawnCircle.bind(null,false,553,0,0,8,290,100,6000)}
	],
	"s-444-1000-1117-0": [{"type": "text","sub_type": "message","message": 'Jump (Bait)',"message_RU": "Прыжок (байт)"}],
	"s-444-1000-1118-0": [{"type": "text","sub_type": "message","message": 'Jump (Tank)',"message_RU": "Прыжок (танк)"}
						  //{"type": "func","func": skillds_event.bind(null, 118)}
	],
	"s-444-1000-1121-0": [{"type": "text","sub_type": "message","message": 'Waves (Left)',"message_RU": "Волны (левая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-1000-1131-0": [{"type": "text","sub_type": "message","message": 'Front -> Left Scratch',"message_RU": "Удар вперед -> левый черкаш"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,358,340,8,660,100,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,358,340,180,500,100,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,358,340,0,500,100,4000)}
	],
	"s-444-1000-1132-0": [
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,0,500,0,2000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,180,500,0,2000)}
	],
	"s-444-1000-1137-0": [
						  {"type": "text","sub_type": "message","message": 'Hammer back ',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-1000-1138-0": [{"type": "text","sub_type": "message","message": 'Knockup (Bait)',"message_RU": "Черкаш (полет)"}],
	"s-444-1000-1139-0": [{"type": "text","sub_type": "message","message": 'Dodge!!',"message_RU": "Эвейд!!!"}],
	"s-444-1000-1140-0": [{"type": "text","sub_type": "message","message": 'Waves (Right)',"message_RU": "Волны (правая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	//-------------------------------------------------------------------------------------------------
	/*
	"h-444-2000-99": [{"type": "func","func": start_boss},
	{
		"type": "spawn",
		"id": 6,
		"sub_delay": 99999999,
		"pos": {
			x: -114567,
			y: 115063,
			z: 4022
		}
	}],
	*/
	"h-444-2000-0": [{"type": "func","func": print_end}],
	"s-444-2000-1101-0": [{"type": "text","sub_type": "message","message": '4 Hit combo',"message_RU": " 270 "},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,195,500,0,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,270,500,0,3000)}
	],
	"s-444-2000-1103-0": [{"type": "text","sub_type": "message","message": 'Front (Dodge)',"message_RU": "Удар вперед (эвейд)"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,400,8,350,100,3000)}
	],
	"s-444-2000-1107-0": [{"type": "text","sub_type": "message","message": '4 Hit (3)',"message_RU": "4"}],
	"s-444-2000-1108-0": [{"type": "text","sub_type": "message","message": 'Back Throw -> Front',"message_RU": "Стан назад -> удар вперед"}],
	"s-444-2000-1111-0": [{"type": "text","sub_type": "message","message": 'Back',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-2000-1112-0": [
						  //{"type": "text","sub_type": "message","message_RU": "完美格挡"},
						  {"type": "text","sub_type": "message","delay": 1240,"message": 'Perfect Defense',"message_RU": "Идеальный блок"},
						  //{"type": "text","sub_type": "message","delay": 2040,"message": "1"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,220,12,210,100,4000)}
	],
	"s-444-2000-1113-0": [{"type": "text","sub_type": "message","message": 'Throw',"message_RU": "Молот (байт)"}],
	"s-444-2000-1114-0": [{"type": "text","sub_type": "message","message": 'Front Slam',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,260,10,320,100,4000)}
	],
	"s-444-2000-1115-0": [{"type": "text","sub_type": "message","message": 'Knockup',"message_RU": "Черкаш (полет)"}],
	"s-444-2000-1116-0": [{"type": "text","sub_type": "message","message": 'Donuts',"message_RU": "Бублики"},
						  {"type": "func","func": SpawnCircle.bind(null,false,553,0,0,8,290,100,6000)}
	],
	"s-444-2000-1117-0": [{"type": "text","sub_type": "message","message": 'Jump (Bait)',"message_RU": "Прыжок (байт)"}],
	"s-444-2000-1118-0": [{"type": "text","sub_type": "message","message": 'Jump (Tank)',"message_RU": "Прыжок (танк)"}
						  //{"type": "func","func": skillds_event.bind(null, 118)}
	],
	"s-444-2000-1119-0": [{"type": "text","sub_type": "message","message": 'Left swipe',"message_RU": "Слева"},
							{"type": "func","func": SpawnMarker.bind(null,false,270,150,0,2500,true,null)}
	],
	"s-444-2000-120-0": [{"type": "text","sub_type": "message","message": 'Right swipe',"message_RU": "Справа"},
						 {"type": "func","func": SpawnMarker.bind(null,false,90,150,0,2500,true,null)}
	],
	"s-444-2000-1121-0": [{"type": "text","sub_type": "message","message": 'Waves (Left)',"message_RU": "Волны (левая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-2000-1122-0": [{"type": "text","sub_type": "message","message": 'Waves (Left) 3nd fast',"message_RU": "Волны(левая) 3 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-2000-1123-0": [{"type": "text","sub_type": "message","message": 'Waves (Left) 2nd fast',"message_RU": "Волны (левая) 2 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-2000-1125-0": [{"type": "text","sub_type": "message","message": 'Front -> Right Scratch',"message_RU": "Удар вперед -> правый черкаш"}, 
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,400,8,350,100,3000)},
						  {"type": "func","func": SpawnVector.bind(null,553,356,400,180,500,100,3000)},
						  {"type": "func","func": SpawnVector.bind(null,553,356,400,0,500,100,3000)}
	],
	"s-444-2000-1126-0": [
						  {"type": "func","func": SpawnVector.bind(null,553,90,200,0,500,0,2000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,200,180,500,0,2000)}
	],
	"s-444-2000-1131-0": [{"type": "text","sub_type": "message","message": 'Front -> Left Scratch',"message_RU": "Удар вперед -> левый черкаш"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,358,340,8,660,100,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,358,340,180,500,100,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,358,340,0,500,100,4000)}
	],
	"s-444-2000-1132-0": [
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,0,500,0,2000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,180,500,0,2000)}],
	"s-444-2000-1135-0": [
						  //{"type": "text","sub_type": "message","message_RU": "完美格挡"},
						  {"type": "text","sub_type": "message","delay": 200,"message": 'Perfect Defense',"message_RU": "Идеальный блок"},
						  //{"type": "text","sub_type": "message","delay": 1535,"message": "1"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,220,12,210,100,4000)}
	],
	"s-444-2000-1137-0": [
						  //{"type": "func","func": skilld_event.bind(null, 137)},
						  {"type": "text","sub_type": "message","message": 'Hammer back ',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-2000-1138-0": [{"type": "text","sub_type": "message","message": 'Knockup (Bait)',"message_RU": "Черкаш (полет)"}],
	"s-444-2000-1139-0": [{"type": "text","sub_type": "message","message": 'Dodge!!',"message_RU": "Эвейд!!!"}],
	"s-444-2000-1140-0": [{"type": "text","sub_type": "message","message": 'Waves (Right)',"message_RU": "Волны (правая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	 "s-444-2000-1141-0": [{"type": "text","sub_type": "message","message": 'Waves (Right) 3nd fast',"message_RU": "Волны (правая) 3 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	 "s-444-2000-1142-0": [{"type": "text","sub_type": "message","message": 'Waves (Right) 2nd fast',"message_RU": "Волны (правая) 2 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-2000-1307-0": [{"type": "text","sub_type": "message","message": '!',"message_RU": "!"},
						  {"type": "text","sub_type": "message","delay": 20000,"message": 'last aerolite',"message_RU": "последний"}
	],
	"s-444-2000-1308-0": [{"type": "text","sub_type": "message","message": 'Stun (1)',"message_RU": "Стан (1)"}],
	"s-444-2000-1309-0": [{"type": "text","sub_type": "message","message": 'Stun (2)',"message_RU": "Стан (2)"}],
	"s-444-2000-1310-0": [{"type": "text","sub_type": "message","message": 'Stun (3)',"message_RU": "Стан (3)"}],
	"s-444-2000-1311-0": [{"type": "text","sub_type": "message","message": 'Wrath',"message_RU": "Облепиха"},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,6000)}
	],
	"s-444-2000-1312-0": [{"type": "text","sub_type": "message","message": 'Wrath',"message_RU": "Облепиха"},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,180,500,0,6000)}],
	//---------------------------------------------------------------------------------------------------
	"s-444-2000-2101-0": [{"type": "text","sub_type": "message","message": '4 Hit combo',"message_RU": " 270 "},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,195,500,0,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,0,0,270,500,0,3000)}
	],
	"s-444-2000-2103-0": [{"type": "text","sub_type": "message","message": 'Front (Dodge)',"message_RU": "Удар вперед (эвейд)"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,400,8,350,100,3000)}
	],
	"s-444-2000-2107-0": [{"type": "text","sub_type": "message","message": '4 Hit (3)',"message_RU": "4"}], 
	"s-444-2000-2108-0": [{"type": "text","sub_type": "message","message": 'Back Throw -> Front',"message_RU": "Стан назад -> удар вперед"}], 
	"s-444-2000-2111-0": [{"type": "text","sub_type": "message","message": 'Back',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-2000-2112-0": [
						  //{"type": "text","sub_type": "message","message_RU": "完美格挡"},
						  {"type": "text","sub_type": "message","delay": 2000,"message": 'Perfect Defense',"message_RU": "Идеальный блок"},
						  {"type": "text","sub_type": "message","delay": 2700,"message": "2"},
						  //{"type": "text","sub_type": "message","delay": 2800,"message": "1"},
						  //{"type": "text","sub_type": "message","delay": 3690,"message": "2"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,220,12,210,100,4000)}
	],
	"s-444-2000-2113-0": [{"type": "text","sub_type": "message","message": 'Throw',"message_RU": "Молот (байт)"}],
	"s-444-2000-2114-0": [{"type": "text","sub_type": "message","message": 'Front Slam',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,260,10,320,100,4000)}
	],
	"s-444-2000-2115-0": [{"type": "text","sub_type": "message","message": 'Knockup',"message_RU": "Черкаш (полет)"}],
	"s-444-2000-2116-0": [{"type": "text","sub_type": "message","message": 'Donuts',"message_RU": "Бублики"},
						  {"type": "func","func": SpawnCircle.bind(null,false,553,0,0,8,290,100,6000)}
	],
	"s-444-2000-2117-0": [{"type": "text","sub_type": "message","message": 'Jump (Bait)',"message_RU": "Прыжок (байт)"}],
	"s-444-2000-2118-0": [{"type": "text","sub_type": "message","message": 'Jump (Tank)',"message_RU": "Прыжок (танк)"}
						  //{"type": "func","func": skillds_event.bind(null, 118)}
	],
	 "s-444-2000-2119-0": [{"type": "text","sub_type": "message","message": 'Left swipe',"message_RU": "Слева"},
						  {"type": "func","func": SpawnMarker.bind(null,false,270,300,100,2000,true,null)}
	],
	 "s-444-2000-2120-0": [{"type": "text","sub_type": "message","message": 'Right swipe',"message_RU": "Справа"},
						  {"type": "func","func": SpawnMarker.bind(null,false,90,300,100,2000,true,null)}
	],
	"s-444-2000-2121-0": [{"type": "text","sub_type": "message","message": 'Waves (Left)',"message_RU": "Волны (слева)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-2000-2122-0": [{"type": "text","sub_type": "message","message": 'Waves (Left) 3nd fast',"message_RU": "Волны (левая) 3 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	 "s-444-2000-2123-0": [{"type": "text","sub_type": "message","message": 'Waves (Left) 2nd fast',"message_RU": "Волны (левая) 2 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	 "s-444-2000-2125-0": [{"type": "text","sub_type": "message","message": 'Front -> Right Scratch',"message_RU": "Удар вперед -> правый черкаш"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,400,8,350,100,3000)},
						  {"type": "func","func": SpawnVector.bind(null,553,356,400,180,500,100,3000)},
						  {"type": "func","func": SpawnVector.bind(null,553,356,400,0,500,100,3000)}
	],
	 "s-444-2000-2126-0": [
						  {"type": "func","func": SpawnVector.bind(null,553,90,200,0,500,2000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,200,180,500,2000)}
	],
	"s-444-2000-2131-0": [{"type": "text","sub_type": "message","message": 'Front -> Left Scratch',"message_RU": "Удар вперед -> левый черкаш"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,358,340,8,660,100,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,358,340,180,500,100,4000)},
						  {"type": "func","func": SpawnVector.bind(null,553,358,340,0,500,100,4000)}
	],
	"s-444-2000-2132-0": [
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,0,500,100,2000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,200,180,500,100,2000)}
	],
	"s-444-2000-2135-0": [
						  //{"type": "text","sub_type": "message","message_RU": "完美格挡快"},
						  {"type": "text","sub_type": "message","delay": 200,"message": 'Perfect Defense',"message_RU": "Идеальный блок"},//--------------------------------
						  {"type": "text","sub_type": "message","delay": 1535,"message": "2"},
						  //{"type": "text","sub_type": "message","delay": 1535,"message": "1"},
						  //{"type": "text","sub_type": "message","delay": 2535,"message": "2"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,356,220,12,210,100,4000)}
	],
	"s-444-2000-2137-0": [
						  //{"type": "func","func": skilld_event.bind(null, 137)},
						  {"type": "text","sub_type": "message","message": 'Hammer back ',"message_RU": "Удар назад"},
						  {"type": "func","func": SpawnCircle.bind(null,false,445,180,500,8,480,100,2000)}
	],
	"s-444-2000-2138-0": [{"type": "text","sub_type": "message","message": 'Knockup (Bait)',"message_RU": "Черкаш (полет)"}],
	"s-444-2000-2139-0": [{"type": "text","sub_type": "message","message": 'Dodge!!',"message_RU": "Эвейд!!!"}],
	"s-444-2000-2140-0": [{"type": "text","sub_type": "message","message": 'Waves (Right)',"message_RU": "Волны (левая)"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"s-444-2000-2141-0": [{"type": "text","sub_type": "message","message": 'Waves (Right) 3nd fast',"message_RU": "Волны (правая) 3 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	 "s-444-2000-2142-0": [{"type": "text","sub_type": "message","message": 'Waves (Right) 2nd fast',"message_RU": "Волны (правая) 2 быстрая"},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,90,50,180,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,0,500,0,6000)},
						  {"type": "func","func": SpawnVector.bind(null,553,270,50,180,500,0,6000)},
						  {"type": "text","sub_type": "message","delay": 60000,"message": 'Waves soon...',"message_RU": "Скоро волны"}
	],
	"ab-444-2000-90442000": [{"type": "func","func": skilld_event.bind(null, 90442000)}],
	"ab-444-2000-90442001": [{"type": "func","func": skilld_event.bind(null, 90442001)}],
	"ab-444-2000-90442304": [{"type": "func","func": skilld_event.bind(null, 90442304)}],
	"ab-444-2000-90444001": [{"type": "func","func": skilld_event.bind(null, 90444001)}],
	"s-444-2500-1201-0": [{"type": "func","func": print_th}],
	"s-444-2500-1305-0": [{"type": "func","func": skilld_event.bind(null, 305)},
						  {"type": "func","func": SpawnVector.bind(null,912,0,0,0,3000,0,4000)}
	]
};