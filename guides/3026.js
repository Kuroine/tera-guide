// Corrupted Skynest
//
// made by michengs / HSDN / ZC

const {MARKER_ITEM, SpawnMarker, SpawnVector, SpawnCircle, SpawnSemicircle} = require("../lib");

let player, entity, library, effect;
let debuff = null;
let timer1;
let timer2;
let timer3;
let timer4;
let timer5;
let boss_entity;
let boss_offset = 0;
let qbacting = null;
let blue = false;
let red  = false;
let debuff_tracker_started = false;

const CK_TipMsg =
{
	0: {msgt: 'IN',  msg: 'К НЕМУ'},
	1: {msgt: 'OUT', msg: 'ОТ НЕГО'}
};
const qbacting_TipMsg =
{
	0: {msgt: 'different', msg: 'разные'},
	1: {msgt: 'same',      msg: 'одинаковые'}
};
const debuff_TipMsg =
{
	0: {msgt: 'Ready to get Fire debuff', msg: 'Готовность к переключению на Огонь'},
	1: {msgt: 'Ready to get Ice debuff',  msg: 'Готовность к переключению на Лед'}
};

// NULL % 2 = 0
//    1 % 2 = 1
//    0 % 2 = 0
//    2 % 2 = 0

function spawn_marker(out, handlers) {
	if (!boss_entity) return;
	let distance = 220;
	let caption  = "IN";
	if (out) {
		distance = 620;
		caption  = "OUT";
	}
	SpawnMarker(false,  45 + boss_offset, distance, 0, 4000, true, [caption, "SAFE"], handlers, null, boss_entity);
	SpawnMarker(false, 135 + boss_offset, distance, 0, 4000, true, [caption, "SAFE"], handlers, null, boss_entity);
	SpawnMarker(false, 225 + boss_offset, distance, 0, 4000, true, [caption, "SAFE"], handlers, null, boss_entity);
	SpawnMarker(false, 315 + boss_offset, distance, 0, 4000, true, [caption, "SAFE"], handlers, null, boss_entity);
}
function debuff_added(id, handlers) {
	debuff_removed();
	debuff = id; // debuff event id
	timer1 = setTimeout(() => {
		if (debuff != null) {
			handlers['text']({
				"sub_type": "message",
				"message": "Debuff 20s",
				"message_RU": "Дебафф 20 сек."
			});
		}
	}, 70000);
	timer2 = setTimeout(() => {
		if (debuff != null) {
			setTimeout(() => {
				handlers['text']({
					"sub_type": "notification",
					"message": (`${debuff_TipMsg[debuff % 2].msgt}`),
					"message_RU": (`${debuff_TipMsg[debuff % 2].msg}`)
				});
			}, 2000);
			handlers['text']({
				"sub_type": "message",
				"message": "Debuff 50s",
				"message_RU": "Дебафф 50 сек."
			});
		}
	}, 40000);
	timer3 = setTimeout(() => {
		if (debuff != null) {
			handlers['text']({
				"sub_type": "message",
				"message": "Warning! Debuff 15s",
				"message_RU": "Дебафф 15 сек."
			});
		}
	}, 75000);
	timer4 = setTimeout(() => {
		if (debuff != null) {
			handlers['text']({
				"sub_type": "message",
				"message": "Warning! Debuff 10s",
				"message_RU": "Дебафф 10 сек."
			});
		}
	}, 80000);
	timer5 = setTimeout(() => {
		if (debuff != null) {
			handlers['text']({
				"sub_type": "message",
				"message": "Warning! Debuff 5s",
				"message_RU": "Дебафф 5 сек."
			});
		}
	}, 85000);
	//
	if (blue) {
		handlers['text']({
			"sub_type": "message",
			"message": (`${CK_TipMsg[(qbacting + debuff + 1) % 2].msgt}`),
			"message_RU": (`${CK_TipMsg[(qbacting + debuff + 1) % 2].msg}`)
		});
		spawn_marker((qbacting + debuff + 1) % 2, handlers);
	} else if (red) {
		handlers['text']({
			"sub_type": "message",
			"message": (`${CK_TipMsg[(qbacting + debuff) % 2].msgt}`),
			"message_RU": (`${CK_TipMsg[(qbacting + debuff) % 2].msg}`)
		});
		spawn_marker((qbacting + debuff) % 2, handlers);
	}
}
function debuff_removed() {
	debuff = null;
	clearTimeout(timer1);
	clearTimeout(timer2);
	clearTimeout(timer3);
	clearTimeout(timer4);
	clearTimeout(timer5);
}
function skilld_event(skillid, handlers, event, entity, dispatch) {
	const abnormality_change = (added, event) => {
		// Fire/Ice debuff
		if (player.isMe(event.target.toString()) && [30260001,30260002,31260001,31260002].includes(event.id)) {
			if (added) {
				debuff_added(event.id, handlers);
			} else {
				debuff_removed();
			}
		}
		// Argon Priest Essence buff
		if (player.isMe(event.target.toString()) && [30261701,31261701].includes(event.id)) {
			if (added && boss_entity) {
				let shield_loc = boss_entity['loc'].clone();
				shield_loc.w = boss_entity['loc'].w;
				handlers['spawn']({ // spawn teleport mark
					"sub_type": "item",
					"id": MARKER_ITEM,
					"sub_delay": 50000,
					"pos": {
						x: 53192,
						y: 100761,
						z: 14233
					}
				}, {
					loc: shield_loc
				});
			}
		}
	};
	// In-Out quest balloons (qbacting => ярость 0, ужас 1)
	if ([3026004,3126004,3026005,3126005].includes(skillid)) {
		qbacting = skillid % 2;
	}
	// Fire/Ice debuff (debuff % 2 => синий 0, красный 1)
	if ([30260001,31260001,30260002,31260002].includes(skillid) && !debuff_tracker_started) {
		debuff_added(skillid, handlers);
	}
	// In-Out identification
	if ([212,213,214,215].includes(skillid)) {
		boss_entity = entity;
		SpawnCircle(false,445,0,0,8,440,200,8000,handlers,event,entity);
		SpawnCircle(false,445,0,0,4,840,200,8000,handlers,event,entity);
	}
	if ([212,214].includes(skillid)) {   // Fire claw (141, 142)
		boss_offset = 10;
		SpawnVector(553,0,0,190,840,200,8000,handlers,event,entity);
		SpawnVector(553,0,0, 10,840,200,8000,handlers,event,entity);
	}
	if ([213,215].includes(skillid)) {   // Ice claw (143, 144)
		boss_offset = -10;
		SpawnVector(553,0,0,170,840,200,8000,handlers,event,entity);
		SpawnVector(553,0,0,350,840,200,8000,handlers,event,entity);
	}
	if ([213,214].includes(skillid)) {   // Ice inside
		setTimeout(() => {
			if (debuff != null) {
				handlers['text']({
					"sub_type": "message",
					"message": (`Ice inside (${qbacting_TipMsg[qbacting].msgt}) | ${CK_TipMsg[(qbacting + debuff + 1) % 2].msgt}`),
					"message_RU": (`Внутри лед (${qbacting_TipMsg[qbacting].msg}) | ${CK_TipMsg[(qbacting + debuff + 1) % 2].msg}`)
				});
				spawn_marker((qbacting + debuff + 1) % 2, handlers);
			} else {
				handlers['text']({
					"sub_type": "message",
					"message": (`Ice inside (${qbacting_TipMsg[qbacting].msgt})`),
					"message_RU": (`Внутри лед (${qbacting_TipMsg[qbacting].msg})`)
				});
			}
		}, 500);
		blue = true;
		red  = false;
		setTimeout(() => blue = false, 6500); //6700
	}
	if ([212,215].includes(skillid)) {   // Fire inside
		setTimeout(() => {
			if (debuff != null) {
				handlers['text']({
					"sub_type": "message",
					"message": (`Fire inside (${qbacting_TipMsg[qbacting].msgt}) | ${CK_TipMsg[(qbacting + debuff) % 2].msgt}`),
					"message_RU": (`Внутри огонь (${qbacting_TipMsg[qbacting].msg}) | ${CK_TipMsg[(qbacting + debuff) % 2].msg}`)
				});
				spawn_marker((qbacting + debuff) % 2, handlers);
			} else {
				handlers['text']({
					"sub_type": "message",
					"message": (`Fire inside (${qbacting_TipMsg[qbacting].msgt})`),
					"message_RU": (`Внутри огонь (${qbacting_TipMsg[qbacting].msg})`)
				});
			}
		}, 500);
		blue = false;
		red  = true;
		setTimeout(() => red = false, 6500);
	}
	if (skillid === 99020020) {   // Death release debuff
		clearTimeout(timer1);
		clearTimeout(timer2);
	}
	if (!debuff_tracker_started) {
		dispatch.hook('S_ABNORMALITY_BEGIN', 4, abnormality_change.bind(null, true));
		dispatch.hook('S_ABNORMALITY_END', 1, abnormality_change.bind(null, false));
		debuff_tracker_started = true;
	}
}

let skills = {
	"112-0": [{"type": "text","sub_type": "message","message": "Ice DOT","message_RU": "Лед (полоса)"}],
	"110-0": [{"type": "text","sub_type": "message","message": "Fire DOT","message_RU": "Огонь (лужа)"}],
	"108-0": [{"type": "text","sub_type": "message","message": "Turn right (repel!!)","message_RU": "Поворот вправо (откид!!)"},{"type": "func","func": SpawnCircle.bind(null,false,912,0,0,8,440,0,2000)}],
	"158-0": [{"type": "text","sub_type": "message","message": "Turn right (repel!!)","message_RU": "Поворот вправо (откид!!)"},{"type": "func","func": SpawnCircle.bind(null,false,912,0,0,8,440,0,2000)}],
	"109-0": [{"type": "text","sub_type": "message","message": "Turn left (repel!!)","message_RU": "Поворот влево (откид!!)"},{"type": "func","func": SpawnCircle.bind(null,false,912,0,0,8,440,0,2000)}],
	"159-0": [{"type": "text","sub_type": "message","message": "Turn left (repel!!)","message_RU": "Поворот влево (откид!!)"},{"type": "func","func": SpawnCircle.bind(null,false,912,0,0,8,440,0,2000)}],
	"120-0": [{"type": "text","sub_type": "message","message": "Together","message_RU": "Яростный рев"}],
	"145-0": [{"type": "text","sub_type": "message","message": "Stun","message_RU": "Стан"}],
	"157-0": [{"type": "text","sub_type": "message","message": "Change","message_RU": "Смена"}],
	"103-0": [{"type": "text","sub_type": "message","message": "Tail (Flying!!)","message_RU": "Хвост (полет!!)"},
		{"type": "func","func": SpawnSemicircle.bind(null,140,260,912,0,0,10,500,0,2000)},
		{"type": "func","func": SpawnVector.bind(null,912,0,0,135,500,0,2000)},
		{"type": "func","func": SpawnVector.bind(null,912,0,0,260,500,0,2000)}
	],
	"153-0": [{"type": "text","sub_type": "message","message": "Tail (Flying!!)","message_RU": "Хвост (полет!!)"},
		{"type": "func","func": SpawnSemicircle.bind(null,140,260,912,0,0,10,500,0,2000)},
		{"type": "func","func": SpawnVector.bind(null,912,0,0,135,500,0,2000)},
		{"type": "func","func": SpawnVector.bind(null,912,0,0,260,500,0,2000)}
	],
	"118-0": [{"type": "text","sub_type": "message","message": "Jump","message_RU": "Прыжок"}],
	"118-1": [{"type": "text","sub_type": "message","message": "Dodge","message_RU": "Эвейд!"}],
	// AOE лед (большой)
	"104-0": [{"type": "text","sub_type": "message","message": "Ice storm DOTs","message_RU": "Ледяные лужи"},{"type": "func","func": SpawnCircle.bind(null,false,553,0,0,8,500,0,5000)}],
	// AOE огонь (большой)
	"105-0": [{"type": "text","sub_type": "message","message": "Fire bombs","message_RU": "Огненные бомбы"},
		{"type": "func","func": SpawnCircle.bind(null,false,553,135,500,10,270,0,3000)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,315,500,10,270,0,3250)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,45,500,10,270,0,3500)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,235,500,10,270,0,3750)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,90,500,10,270,0,4000)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,270,500,10,270,0,4250)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,0,500,10,270,0,4500)},
		{"type": "func","func": SpawnCircle.bind(null,false,553,180,500,10,270,0,4750)}
	],
	// AOE лед (малый)
	"154-0": [{"type": "text","sub_type": "message","message": "Ice storm","message_RU": "Ледяной шторм"},{"type": "func","func": SpawnCircle.bind(null,false,553,0,0,8,500,0,6000)}],
	// AOE огонь (малый)
	"155-0": [{"type": "text","sub_type": "message","message": "Fire (knock down)","message_RU": "Огненный столб (опрокид)"},
		{"type": "text","sub_type": "message","delay": 1200,"message": "Dodge","message_RU": "Эвейд"}
	],
	//
	"206-0": [{"type": "text","sub_type": "message","message": "Jump back","message_RU": "Прыжок назад"}],
	"206-2": [{"type": "func","func": SpawnCircle.bind(null,false,553,0,0,15,350,0,3000)}],
	"137-0": [{"type": "text","sub_type": "message","message": "Knock down","message_RU": "Опрокидывание"}],
	"138-0": [{"type": "text","sub_type": "message","message": "AOE","message_RU": "AOE"}],
	"139-0": [{"type": "text","sub_type": "message","message": "60 degrees (Fire)","message_RU": "60° (Огонь всем)"}],
	"140-0": [{"type": "text","sub_type": "message","message": "40 degrees (Ice)","message_RU": "40° (Лед всем)"}],
	//
	"s-3026-1000-1212-0": [{"type": "func","func": skilld_event.bind(null, 212)}],
	"s-3026-1000-1215-0": [{"type": "func","func": skilld_event.bind(null, 215)}],
	"s-3026-1000-1213-0": [{"type": "func","func": skilld_event.bind(null, 213)}],
	"s-3026-1000-1214-0": [{"type": "func","func": skilld_event.bind(null, 214)}],
	"qb-3026-1000-3026005": [{"type": "func","func": skilld_event.bind(null, 3026005)}], // ужас, одинаковые цвета
	"qb-3026-1000-3026004": [{"type": "func","func": skilld_event.bind(null, 3026004)}], // ярость, разные цвета
	"qb-3026-1000-3126005": [{"type": "func","func": skilld_event.bind(null, 3126005)}], // ужас, одинаковые цвета
	"qb-3026-1000-3126004": [{"type": "func","func": skilld_event.bind(null, 3126004)}], // ярость, разные цвета
	"ae-0-0-99020020": [{"type": "func","func": skilld_event.bind(null, 99020020)}],
	"am-3026-1000-30260001": [{"type": "func","func": skilld_event.bind(null, 30260001)}], // красный
	"am-3026-1000-30260002": [{"type": "func","func": skilld_event.bind(null, 30260002)}], // синий
	"am-3026-1000-31260001": [{"type": "func","func": skilld_event.bind(null, 31260001)}], // красный
	"am-3026-1000-31260002": [{"type": "func","func": skilld_event.bind(null, 31260002)}], // синий
};

module.exports = {
	load(dispatch) {
		({ player, entity, library, effect } = dispatch.require.library);
	}
};

for (let [key, value] of Object.entries(skills)) {
	if (key.length === 5) {
		module.exports['s-3026-1000-1' + key] = value;
		module.exports['s-3026-1000-2' + key] = value;
	} else {
		module.exports[key] = value;
	}
}