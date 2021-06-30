const DispatchWrapper = require('./dispatch');
const fs = require('fs');
const path = require('path');
const dbg = require('./dbg');
const eszones = require('./zones/esguidezones')
const spzones = require('./zones/spguidezones')
let voice = null;
try { voice = require('./voice') }
catch(e) { voice = null; }
// Tank class ids(brawler + lancer)
//1 = Lancer
const TANK_CLASS_IDS = [1, 10];
// Dps class ids(not counting warrior)
const DPS_CLASS_IDS = [2, 3, 4, 5, 8, 9, 11, 12];
// Healer class ids
//6 = Mystic 7 = Priest
const HEALER_CLASS_IDS = [6, 7];
// Warrior Defence stance abnormality ids
const WARRIOR_TANK_IDS = [100200, 100201];
// Messages colors
const cr  = '</font><font color="#ff0000">'; // red
const co  = '</font><font color="#ff7700">'; // orange
const cy  = '</font><font color="#ffff00">'; // yellow
const cg  = '</font><font color="#00ff00">'; // green
const cdb = '</font><font color="#2727ff">'; // dark blue
const cb  = '</font><font color="#0077ff">'; // blue
const cv  = '</font><font color="#7700ff">'; // violet
const cp  = '</font><font color="#ff00ff">'; // pink
const clp = '</font><font color="#ff77ff">'; // light pink
const clb = '</font><font color="#00ffff">'; // light blue
const cbl = '</font><font color="#000000">'; // black
const cgr = '</font><font color="#777777">'; // gray
const cw  = '</font><font color="#ffffff">'; // white

let idStorage = {}; //Despawn IDs
let hpArray = []; //Hp Array

class TeraGuide{
	constructor(dispatch) {
		const fake_dispatch = new DispatchWrapper(dispatch);
		const { player, entity, library, effect } = dispatch.require.library;
		const command = dispatch.command;

		// An object of types and their corresponding function handlers
		const function_event_handlers = {
			"spawn": spawn_handler,
			"despawn": despawn_handler,
			"text": text_handler,
			"stop_timer": stop_timer_handler,
			"func": func_handler,
			"lib": require('./lib')
		};
	
		// export functionality for 3rd party modules
		this.handlers = function_event_handlers;
		// Supported languages by client
		let languages = {0: 'en', 1: 'kr', 3: 'jp', 4: 'de', 5: 'fr', 7: 'tw', 8: 'ru'};
		// Detected language
		let language = languages[0];
		// A boolean for the debugging settings
		let debug = dbg['debug'];
		// A boolean indicating if a guide was found
		let guide_found = false;
		let spguide = false;
		let esguide = false;
		//let cc = cg;
		// The guide settings for the current zone
		let active_guide = {};
		// All of the timers, where the key is the id
		let random_timer_id = 0xFFFFFFFA; // Used if no id is specified
		let timers = {};
		// Entered zone guide data
		let entered_zone_data = {};
		// Trigger event flag
		let is_event = false;

		/** C_LOGIN_ARBITER **/

		dispatch.hook('C_LOGIN_ARBITER', 2, event => {
			// Set client language
			language = languages[event.language] || languages[0];
		});

		/** HELPER FUNCTIONS **/

		// Find index for dungeons settings param
		function find_dungeon_index(id) {
			for (let i in dispatch.settings.dungeons) {
				if (dispatch.settings.dungeons[i].id == id) {
					return i;
				}
			}
			return false;
		}

		// Write generic debug message used when creating guides
		function debug_message(d, ...args) {
			if (d) {
				console.log(`[${Date.now() % 100000}][Guide]`, ...args);
				if (debug.chat) command.message(args.toString());
			}
		}

		// Makes sure the event passes the class position check
		function class_position_check(class_position) {
			// if it's not defined we assume that it's for everyone
			if (!class_position) return true;
			// If it's an array
			if (Array.isArray(class_position)) {
				// If one of the class_positions pass, we can accept it
				for (let ent of class_position) if (class_position_check(ent)) return true;
				// All class_positions failed, so we return false
				return false;
			}
			switch (class_position) {
				case "tank": {
					// if it's a warrior with dstance abnormality
					if (player.job === 0) {
						// Loop thru tank abnormalities
						for(let id of WARRIOR_TANK_IDS) {
							// if we have the tank abnormality return true
							if(effect.hasAbnormality(id)) return true;
						}
					}
					// if it's a tank return true
					if(TANK_CLASS_IDS.includes(player.job)) return true;
					break;
				}
				case "dps": {
					// If it's a warrior with dstance abnormality
					if (player.job === 0) {
						// Loop thru tank abnormalities
						for(let id of WARRIOR_TANK_IDS) {
							// if we have the tank abnormality return false
							if(effect.hasAbnormality(id)) return false;
						}
						// warrior didn't have tank abnormality
						return true;
					}
					// if it's a dps return true
					if (DPS_CLASS_IDS.includes(player.job)) return true;
					break;
				}
				case "heal": {
					// if it's a healer return true
					if(HEALER_CLASS_IDS.includes(player.job)) return true;
					break;
				}
				case "priest":{
					if(player.job === 6) return true;
					break;
				}
				case "mystic":{
					if(player.job === 7) return true;
					break;
				}
				case "lancer":{
					if(player.job === 1) return true;
					break;
				}
				default: {
					debug_message(true, "Failed to find class_position value:", class_position);
				}
			}
			return false;
		}

		// Handle events such as boss skill and abnormalities triggered
		function handle_event(ent, id, called_from_identifier, prefix_identifier, d, speed = 1.0, stage = false) {
			const unique_id = `${prefix_identifier}-${ent['huntingZoneId']}-${ent['templateId']}`;
			const key = `${unique_id}-${id}`;
			const stage_string = (stage === false ? '' : `-${stage}`);
			debug_message(d, `${called_from_identifier}: ${id} | Started by: ${unique_id} | key: ${key + stage_string}`);
			if(stage !== false) {
				const entry = active_guide[key + stage_string];
				if (entry) start_events(entry, ent, speed);
			}
			const entry = active_guide[key];
			if (entry) start_events(entry, ent, speed);
		}

		// This is where all the magic happens
		function start_events(events = [], ent, speed = 1.0) {
			// Loop over the events
			for (let event of events) {
				const func = function_event_handlers[event['type']];
				// The function couldn't be found, so it's an invalid type
				if (!func) debug_message(true, "An event has invalid type:", event['type']);
				// If the function is found and it passes the class position check, we start the event
				else if (class_position_check(event['class_position'])) func(event, ent, speed = 1.0);
			}
		}

		/** S_ACTION_STAGE **/

		// Boss skill action
		function s_action_stage(e) {
			let eskillid;

			if(spguide){
				eskillid = e.skill.id;
			}
			else if(esguide){
				eskillid = e.skill.id > 3000 ? e.skill.id : e.skill.id % 1000;
			}
			else{
				eskillid = e.skill.id % 1000;
			}	
			
			// If the guide module is active and a guide for the current dungeon is found
			if (dispatch.settings.enabled && guide_found) {
				const ent = entity['mobs'][e.gameId.toString()];
				// Due to a bug for some bizare reason(probably proxy fucking itself) we do this ugly hack
				e.loc.w = e.w;
				// We've confirmed it's a mob, so it's plausible we want to act on this
				if (ent) return handle_event(Object.assign({}, ent, e), eskillid, 'Skill', 's', debug.debug || debug.skill || (ent['templateId'] % 1 === 0 ? debug.boss : false), e.speed, e.stage);
			}
		}
		dispatch.hook('S_ACTION_STAGE', 9, {order: 15}, s_action_stage);
		
		/** ABNORMALITY **/

		// Boss abnormality triggered
		function abnormality_triggered(e) {
			// If the guide module is active and a guide for the current dungeon is found
			if (dispatch.settings.enabled && guide_found) {
				// avoid errors ResidentSleeper (neede for abnormality refresh)
				if (!e.source) e.source = 0n;
				// If the boss/mob get's a abnormality applied to it
				const target_ent = entity['mobs'][e.target.toString()];
				// If the boss/mob is the cause for the abnormality
				const source_ent = entity['mobs'][e.source.toString()];
				// If the mob/boss applies an abnormality to me, it's plausible we want to act on this
				if (source_ent && player.isMe(e.target)) handle_event(source_ent, e.id, 'Abnormality', 'am', debug.debug || debug.abnormal);
				// If "nothing"/server applies an abnormality to me, it's plausible we want to act on this. (spam rip)
				if (player.isMe(e.target) && 0 == (e.source || 0)) handle_event({
					huntingZoneId: 0,
					templateId: 0
				}, e.id, 'Abnormality', 'ae', debug.debug || debug.abnormal);
				// If it's a mob/boss getting an abnormality applied to itself, it's plausible we want to act on it
				if (target_ent) handle_event(target_ent, e.id, 'Abnormality', 'ab', debug.debug || debug.abnormal);
			}
		}
		dispatch.hook('S_ABNORMALITY_BEGIN', 5, {order: 15}, abnormality_triggered);
		dispatch.hook('S_ABNORMALITY_REFRESH', 2, {order: 15}, abnormality_triggered);

		/** HEALTH **/

		// Boss health bar triggered
		dispatch.hook('S_BOSS_GAGE_INFO', 3, e => {
			// If the guide module is active and a guide for the current dungeon is found
			if(dispatch.settings.enabled && guide_found) {
				const ent = entity['mobs'][e.id.toString()];
				if (ent) {
					// We've confirmed it's a mob, so it's plausible we want to act on this
					let hpValue = Math.floor(Number(e.curHp) / Number(e.maxHp) * 100);
					if (hpArray.includes(hpValue)) return;
					else {
						hpArray.push(hpValue);
						return handle_event(ent, hpValue, 'Health', 'h', debug.debug || debug.hp);
					} 
					//if (ent) return handle_event(ent, Math.floor(Number(e.curHp) / Number(e.maxHp) * 100), 'Health', 'h', debug.debug || debug.hp);
				}
			}
		});

		//Boss despawned
		dispatch.hook('S_DESPAWN_NPC',3, e =>{
			const ent = entity['mobs'][e.gameId.toString()];
			//const ent = entity.mobs[e.gameId.toString()];
			if(ent){
				hpArray = []; //Reset HP Array
				return handleEvent(["nd", ent.huntingZoneId, ent.templateId], ent, debug.debug || debug.nd);
			}
		});

		/** S_DUNGEON_EVENT_MESSAGE **/

		dispatch.hook('S_DUNGEON_EVENT_MESSAGE', 2, e => {
			if (dispatch.settings.enabled && guide_found) {
				const result = /@dungeon:(\d+)/g.exec(e.message);
				if (result) {
					handle_event({
						huntingZoneId: 0,
						templateId: 0
					}, parseInt(result[1]), 'Dungeon Message', 'dm', debug.debug || debug.dm);
				}
			}
		});

		/** S_QUEST_BALLOON **/

		dispatch.hook('S_QUEST_BALLOON', 1, e => {
			if (dispatch.settings.enabled && guide_found) {
				const source_ent = entity['mobs'][e.source.toString()];
				const result = /@monsterBehavior:(\d+)/g.exec(e.message);
				if (result && source_ent) {
					handle_event(source_ent, parseInt(result[1]), 'Quest Balloon', 'qb', debug.debug || debug.qb);
				}
			}
		});

		/** S_LOAD_TOPO **/

		function entry_zone(zone) {
			// Enable errors debug
			let debug_errors = true;
			// Disable trigger event flag
			is_event = false;
			// Clear out the timers
			for (let key in timers) clearTimeout(timers[key]);
			timers = {};
			idStorage = {};
			//Clear Out The HP Array
			hpArray = [];
			// Clear out previous hooks, that our previous guide module hooked
			fake_dispatch._remove_all_hooks();
			// Send debug message
			debug_message(debug.debug, 'Entered zone:', zone);
			// Remove potential cached guide from require cache, so that we don't need to relog to refresh guide
			try {
				delete require.cache[require.resolve('./guides/' + zone)];
			} catch(e) {}
			// Try loading a guide
			try {
				// Find and load zone data from settings
				entered_zone_data = {};
				for (const i of dispatch.settings.dungeons) {
					if (i.id == zone) {
						entered_zone_data = i;
						break;
					}
				}
				if (zone == "test") {
					entered_zone_data = {"id": "test", "name": "Test Guide", "name_RU": "Test Guide", "verbose": true, "spawnObject": true};
				}
				if (!entered_zone_data.id) {
					debug_errors = debug.debug;
					throw 'Guide for zone ' + zone + ' not found in config';
				}
				active_guide = require('./guides/' + zone);
				if (spzones.id.includes(zone)) {
					//******SKILL ID RANGES******//
					//ENR 2000-2999 //NON-ENR 1000-1999 //3000-3999
					spguide = true;
					esguide = false;
				} 
				else if (eszones.id.includes(zone)) {
					//******SKILL ID RANGES******//
					//100-299 //3000-3999
					spguide = false;
					esguide = true;
				} 
				else {
					//******SKILL ID RANGES******//
					//100-399
					spguide = false;  
					esguide = false;
				}
				guide_found = true;
				if (entered_zone_data.name) {
					if (spguide) {
						text_handler({
							"sub_type": "PRMSG",
							"delay": 8000,
							"message_RU": 'Вы вошли в ' + cr + entered_zone_data.name_RU + cw + ' [' + zone + ']', 
							"message": 'Enter SP Dungeon: ' +  cr + entered_zone_data.name + cw + ' [' + zone + ']'
						});
					} else if (esguide) {
						text_handler({
							"sub_type": "PRMSG",
							"delay": 8000,
							"message_RU": 'Вы вошли в ' + cr + entered_zone_data.name_RU + cw + ' [' + zone + ']',
							"message": 'Enter ES Dungeon: ' + cr + entered_zone_data.name + cw + ' [' + zone + ']'
						 });
					} else {
						text_handler({
							"sub_type": "PRMSG",
							"delay": 8000,
							"message_RU": 'Вы вошли в ' + cr + entered_zone_data.name_RU + cw + ' [' + zone + ']',
							"message": 'Enter Dungeon: ' + cr + entered_zone_data.name + cw + ' [' + zone + ']'
						});
					}
				}
			} catch(e) {
				entered_zone_data = {};
				active_guide = {};
				guide_found = false;
				debug_message(debug_errors, e);
			}
			if (guide_found) {
				// Try calling the "load" function
				try {
					active_guide.load(fake_dispatch);
				} catch(e) {
					debug_message(debug_errors, e);
				}
			}
		}

		// Load guide and clear out timers
		dispatch.hook('S_LOAD_TOPO', 3, e => { entry_zone(e.zone) });

		/** MISC **/

		// Guide command
		command.add(['guide'], {
			// Toggle debug settings
			debug(arg1) {
				if (!arg1) {
					arg1 = 'debug';
				} else if (arg1 === 'status') {
					for (let [key, value] of Object.entries(debug)) {
						command.message(`debug(${key}): ${value ? "enabled" : "disabled"}.`);
					}
					return;
				} else if (debug[arg1] === undefined) {
					return command.message(`Invalid sub command for debug mode. ${arg1}`);
				}
				debug[arg1] = !debug[arg1];
				command.message(`Guide module debug(${arg1}) mode has been ${debug[arg1] ? "enabled" : "disabled"}.`);
			},
			// Testing events
			event(arg1, arg2) {
				// Enable trigger event flag
				is_event = true;
				// Clear library cache
				try {
					delete require.cache[require.resolve('./lib')];
				} catch(e) {}
				// If arg1 is "load", load guide from arg2 specified
				if (arg1 === "load") {
					if (!arg2) return command.message(`Invalid values for sub command "event" ${arg1}`);
					return entry_zone(arg2);
				}
				// If arg1 is "reload", reload current loaded guide
				if (arg1 === "reload") {
					if (!entered_zone_data.id) return command.message("Guide not loaded");
					return entry_zone(entered_zone_data.id);
				}
				// If we didn't get a second argument or the argument value isn't an event type, we return
				if (arg1 === "trigger" ? (!active_guide[arg2]) : (!arg1 || !function_event_handlers[arg1] || !arg2)) return command.message(`Invalid values for sub command "event" ${arg1} | ${arg2}`);
				// if arg2 is "trigger". It means we want to trigger a event
				if (arg1 === "trigger") {
					start_events(active_guide[arg2], player);
				} else {
					try {
						// Call a function handler with the event we got from arg2 with yourself as the entity
						function_event_handlers[arg1](JSON.parse(arg2), player);
					} catch(e) {
						// Disable trigger event flag
						is_event = false;
						debug_message(true, e);
					}
				}
				// guide event text '{"sub_type":"message","message":"Сообщение"}'
				// guide event spawn '{"type":"item","id":"1","sub_delay":"999999"}'
			},
			voice() {
				dispatch.settings.speaks = !dispatch.settings.speaks;
				text_handler({"sub_type": "PRMSG","message_RU": `Голосовое сообщение ${dispatch.settings.speaks?"Вкл":"Выкл"}.`, "message": `Text-to-speech ${dispatch.settings.speaks?"on":"off"}.` });
			},
			stream() {
				dispatch.settings.stream = !dispatch.settings.stream;
				text_handler({"sub_type": "PRMSG","message_RU": `Стрим, скрытие сообщений ${dispatch.settings.stream?"Вкл":"Выкл"}.`, "message": `Stream ${dispatch.settings.stream?"on":"off"}.`});
			},
			spawnObject(arg1) {
				let sd_id;
				if (arg1) {
					sd_id = find_dungeon_index(arg1);
					if (sd_id) {
						dispatch.settings.dungeons[sd_id].spawnObject = !dispatch.settings.dungeons[sd_id].spawnObject;
						text_handler({"sub_type": "PRMSG",
							"message_RU": `Спавн объектов для данжа ${dispatch.settings.dungeons[sd_id].name_RU} [${dispatch.settings.dungeons[sd_id].id}]: ${dispatch.settings.dungeons[sd_id].spawnObject?"Вкл":"Выкл"}.`, 
							"message": `Spawning objects for dungeon ${dispatch.settings.dungeons[sd_id].name_RU} [${dispatch.settings.dungeons[sd_id].id}] has been ${dispatch.settings.dungeons[sd_id].spawnObject?"on":"off"}.`
						});
					} else {
						text_handler({"sub_type": "PRMSG","message_RU": `Данж с таким id не найден.`, "message": `Dungeon not found.` });
					}
				} else {
					dispatch.settings.spawnObject = !dispatch.settings.spawnObject;
					text_handler({"sub_type": "PRMSG","message_RU": `Спавн объектов: ${dispatch.settings.spawnObject?"Вкл":"Выкл"}.`, "message": `Spawn objects ${dispatch.settings.spawnObject?"on":"off"}.` });
				}
			},
			verbose(arg1) {
				let sd_id;
				if (arg1) {
					sd_id = find_dungeon_index(arg1);
					if (sd_id) {
						dispatch.settings.dungeons[sd_id].verbose = !dispatch.settings.dungeons[sd_id].verbose;
						text_handler({"sub_type": "PRMSG",
							"message_RU": `Показ сообщений для данжа ${dispatch.settings.dungeons[sd_id].name_RU} [${dispatch.settings.dungeons[sd_id].id}]: ${dispatch.settings.dungeons[sd_id].verbose?"Вкл":"Выкл"}.`,
							"message": `Messaging for dungeon ${dispatch.settings.dungeons[sd_id].name_RU} [${dispatch.settings.dungeons[sd_id].id}] has been ${dispatch.settings.dungeons[sd_id].verbose?"on":"off"}.`
						});
					} else {
						text_handler({"sub_type": "PRMSG","message_RU": `Данж с таким id не найден.`, "message": `Dungeon not found.`});
					}
				} else {
					text_handler({"sub_type": "PRMSG","message_RU": `Не указан id данжа.`, "message": `Dungeon id not specified.`});
				}
			},
			alert() {
				dispatch.settings.notice = !dispatch.settings.notice;
				text_handler({"sub_type": "PRMSG","message_RU": `Сообщения в чат: ${dispatch.settings.notice?"Вкл":"Выкл"}.`, "message": `Virtual captain has been ${dispatch.settings.notice?"on":"off"}.`});
			},
			systemNotice() {
				dispatch.settings.systemNotice = !dispatch.settings.systemNotice;
				command.message(`system Notice ${dispatch.settings.systemNotice?"on":"off"}.`);
				text_handler({"sub_type": "PRMSG","message_RU": `сообщения в группе: ${dispatch.settings.systemNotice?"Вкл":"Выкл"}.`, "message": `system Notice ${dispatch.settings.systemNotice?"on":"off"}.`});
			},
			cr() {
				text_handler({"sub_type": "CRMSG","message_RU": `Цвет системного сообщения: красный`, "message": `system message notification color is red`});
				dispatch.settings.cc.splice(0,1, cr );
			},
			cc() {
				text_handler({"sub_type": "PRMSG","message_RU": `Текущий цвет системного сообщения`, "message": `View the current system message notification color`});
			},
			co() {
				text_handler({"sub_type": "COMSG","message_RU": `Цвет системного сообщения: оранжевый`, "message": `system message notification color is  ORANGE`});
				dispatch.settings.cc.splice(0,1, co);
			},
			cy() {
				text_handler({"sub_type": "CYMSG","message_RU": `Цвет системного сообщения: желтый`, "message": `system message notification color is YELLOW`});
				dispatch.settings.cc.splice(0,1, cy);
			},
			cg() {
				text_handler({"sub_type": "CGMSG","message_RU": `Цвет системного сообщения: зеленый`, "message": `system message notification color is GREEN`});
				dispatch.settings.cc.splice(0,1, cg);
			},
			cdb() {
				text_handler({"sub_type": "CDBMSG","message_RU": `Цвет системного сообщения: темно-синий`, "message": `system message notification color is DARK BLUE`});
				dispatch.settings.cc.splice(0,1, cr);
			},
			cb() {
				text_handler({"sub_type": "CBMSG","message_RU": `Цвет системного сообщения: синий`, "message": `system message notification color is BLUE`});
				dispatch.settings.cc.splice(0,1, cb);
			},
			cv() {
				text_handler({"sub_type": "CVMSG","message_RU": `Цвет системного сообщения: фиолетовый`, "message": `system message notification color is VIOLET`});
				dispatch.settings.cc.splice(0,1, cv);
			},
			cp() {
				text_handler({"sub_type": "CPMSG","message_RU": `Цвет системного сообщения: розовый`, "message": `system message notification color is PINK`});
				dispatch.settings.cc.splice(0,1, cp);
			},
			clp() {
				text_handler({"sub_type": "CLPMSG","message_RU": `Цвет системного сообщения: светло-розовый`, "message": `system message notification color is LIGHT PINK`});
				dispatch.settings.cc.splice(0,1, clp);
			},
			clb() {
				text_handler({"sub_type": "CLBMSG","message_RU": `Цвет системного сообщения: светло-синий`, "message": `system message notification color is LIGHT BLUE`});
				dispatch.settings.cc.splice(0,1, clb);
			},
			cbl() {
				text_handler({"sub_type": "CBLMSG","message_RU": `Цвет системного сообщения: черный`, "message": `system message notification color is  BLACK`});
				dispatch.settings.cc.splice(0,1, cbl);
			},
			cgr() {
				text_handler({"sub_type": "CGRMSG","message_RU": `Цвет системного сообщения: серый`, "message": `system message notification color is  GRAY`});
				dispatch.settings.cc.splice(0,1, cgr);
			},	
			cw() {
				text_handler({"sub_type": "CWMSG","message_RU": `Цвет системного сообщения: белый`, "message": `system message notification color is  WHITE`});
				dispatch.settings.cc.splice(0,1, cw);
			},
			dungeons() {
				for (const i of dispatch.settings.dungeons) {
					text_handler({"sub_type": "CWMSG","message_RU": `${i.id} - ${i.name_RU}`, "message": `${i.id} - ${i.name}`});
				}
			},
			help() {
				text_handler({"sub_type": "PRMSG","message_RU": 'guide, вкл./выкл. модуля', "message": 'guide,  on/off, default system notification, notification color yellow'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide voice, вкл./выкл. голосовые сообщения', "message": 'guide voice, text-to-speech on/off'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide systemNotice, вкл./выкл. сообщений в группе', "message": 'guide systemNotice, system Notice on/off'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide alert, вкл./выкл. сообщений в чате', "message": 'guide alert, Virtual captain  notifie on/off'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide spawnObject, вкл./выкл. спавна объектов', "message": 'guide spawnObject, spawn Object on/off'}); 
				text_handler({"sub_type": "PRMSG","message_RU": 'guide stream, вкл./выкл. режима стрима (скрытие сообщений)', "message": 'guide stream,(stream)on/off'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide dungeons, список всех поддерживаемых данжей и их id', "message": 'guide dungeons, list of all supported dungeons'}); 
				text_handler({"sub_type": "PRMSG","message_RU": 'guide verbose id, вкл./выкл. всех сообщений для данжа, где id - идентификатор данжа', "message": 'verbose id, messaging for dungeon on/off'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide spawnObject id, вкл./выкл. спавна объектов для данжа, где id - идентификатор данжа', "message": 'guide spawnObject id, spawn objects for dungeon on/off'});
				text_handler({"sub_type": "PRMSG","message_RU": 'guide cc, отобразить текущий цвет системного сообщения', "message": 'guide cc,View the current system message notification color'});
				text_handler({"sub_type": "CRMSG","message_RU": 'guide cr, установить цвет сообщения: красный', "message": 'guide cr,message color is red'});
				text_handler({"sub_type": "COMSG","message_RU": 'guide c, установить цвет сообщения: оранжевый', "message": 'guide co,message color is ORANGE'});
				text_handler({"sub_type": "CYMSG","message_RU": 'guide cy, установить цвет сообщения: желтый', "message": 'guide cy,message color is YELLOW'});
				text_handler({"sub_type": "CGMSG","message_RU": 'guide cg, установить цвет сообщения: зеленый', "message": 'guide cg,message color is GREEN'});
				text_handler({"sub_type": "CDBMSG","message_RU": 'guide cdb, установить цвет сообщения: темно-синий', "message": 'guide cdb,message color is DARK BLUE'});
				text_handler({"sub_type": "CBMSG","message_RU": 'guide cb, установить цвет сообщения: синий', "message": 'guide cb,message color is BLUE' });
				text_handler({"sub_type": "CVMSG","message_RU": 'guide cv, установить цвет сообщения: фиолетовый', "message": 'guide cv,message color is VIOLET'});
				text_handler({"sub_type": "CPMSG","message_RU": 'guide cp, установить цвет сообщения: розовый', "message": 'guide cp,message color is PINK' });
				text_handler({"sub_type": "CLPMSG","message_RU": 'guide clp, установить цвет сообщения: светло-розовый', "message": 'guide clp,message color is LIGHT PINK'});
				text_handler({"sub_type": "CLBMSG","message_RU": 'guide clb, установить цвет сообщения: светло-синий', "message": 'guide clb,message color is LIGHT BLUE'});
				text_handler({"sub_type": "CBLMSG","message_RU": 'guide cbl, установить цвет сообщения: черный', "message": 'guide cbl,message color is BLACK'});
				text_handler({"sub_type": "CGRMSG","message_RU": 'guide cgr, установить цвет сообщения: серый', "message": 'guide cgr,message color is GRAY'});
				text_handler({"sub_type": "CWMSG","message_RU": 'guide cw, установить цвет сообщения: белый', "message": 'guide cw,message color is WHITE'});
			},
			$default() {
				dispatch.settings.enabled = !dispatch.settings.enabled;
				text_handler({"sub_type": "PRMSG","message_RU": `Модуль: ${dispatch.settings.enabled?"Вкл":"Выкл"}.`, "message": `guide ${dispatch.settings.enabled?"on":"off"}.`});
			}
		});

		/** Function/event handlers for types **/

		// Spawn handler
		function spawn_handler(event, ent, speed=1.0) {
			if (dispatch.settings.stream) return;
			if (!dispatch.settings.spawnObject) return;
			if (!entered_zone_data.spawnObject && !is_event) return;
			// Make sure id is defined
			if (!event['id']) return debug_message(true, "Spawn handler needs a id");
			// Make sure sub_delay is defined
			if (!event['sub_delay']) return debug_message(true, "Spawn handler needs a sub_delay");
			// Make sure distance is defined
			//if(!event['distance']) return debug_message(true, "Spawn handler needs a distance");
			// Ignore if dispatch.settings.streamer mode is enabled
			// Set sub_type to be collection as default for backward compatibility
			const sub_type =  event['sub_type'] || 'collection';
			// The unique spawned id this item will be using.
			const item_unique_id = event['force_gameId'] || random_timer_id--;
			// The location of the item spawned
			let loc = ent['loc'].clone();
			// if pos is set, we use that
			if (event['pos']) loc = event['pos'];
			loc.w = (ent['loc'].w || 0) + (event['offset'] || 0);
			library.applyDistance(loc, event['distance'] || 0 ,event['degrees'] || 0);
			let sending_event = {
				gameId: item_unique_id,
				loc: loc,
				w: loc.w
			};
			const despawn_event = {
				gameId: item_unique_id,
				unk: 0, // used in S_DESPAWN_BUILD_OBJECT
				collected: false // used in S_DESPAWN_COLLECTION
			};
			// Create the sending event
			switch (sub_type) {
				// If it's type collection, it's S_SPAWN_COLLECTION
				case "collection": {
					Object.assign(sending_event, {
						id: event['id'],
						amount: 1,
						extractor: false,
						extractorDisabled: false,
						extractorDisabledTime: 0
					});
					break;
				}
				// If it's type item, it's S_SPAWN_DROPITEM
				case "item": {
					Object.assign(sending_event, {
						item: event['id'],
						amount: 1,
						expiry: 0,
						explode: false,
						masterwork: false,
						enchant: 0,
						debug: false,
						owners: []
					});
					break;
				}
				// If it's type build_object, it's S_SPAWN_BUILD_OBJECT
				case "build_object": {
					Object.assign(sending_event, {
						itemId : event['id'],
						unk : 0,
						ownerName : event['ownerName'] || '',
						message : event['message'] || ''
					});
					break;
				}
				// If we haven't implemented the sub_type the event asks for
				default: {
					return debug_message(true, "Invalid sub_type for spawn handler:", event['sub_type']);
				}
			}
			// Create the timer for spawning the item
			timers[item_unique_id] = setTimeout(()=> {
				switch(sub_type) {
					case "collection": idStorage[item_unique_id] = sub_type; return dispatch.toClient('S_SPAWN_COLLECTION', 4, sending_event);
					case "item": idStorage[item_unique_id] = sub_type; return dispatch.toClient('S_SPAWN_DROPITEM', 9, sending_event);
					case "build_object": idStorage[item_unique_id] = sub_type; return dispatch.toClient('S_SPAWN_BUILD_OBJECT', 2, sending_event);
				}
			}, event['delay'] || 0 / speed);
			// Create the timer for despawning the item
			timers[random_timer_id--] = setTimeout(()=> {
				switch (sub_type) {
					case "collection": delete idStorage[item_unique_id]; return dispatch.toClient('S_DESPAWN_COLLECTION', 2, despawn_event);
					case "item": delete idStorage[item_unique_id]; return dispatch.toClient('S_DESPAWN_DROPITEM', 4, despawn_event);
					case "build_object": delete idStorage[item_unique_id]; return dispatch.toClient('S_DESPAWN_BUILD_OBJECT', 2, despawn_event);
				}
			}, event['sub_delay'] / speed);
		}

		// Despawn handler
		function despawn_handler(event) {
			// Make sure id is defined
			if (Object.keys(idStorage).length === 0) return;
			//if (!event['id']) return debug_message(true, "Spawn handler needs a id");
			if (!dispatch.settings.spawnObject) return;
			// Ignore if dispatch.settings.streamer mode is enabled
			if (dispatch.settings.stream) return;
			// Set sub_type to be collection as default for backward compatibility
			const sub_type = event['sub_type'] || 'collection';
			const despawn_event = {
				gameId: 0, //Temp 0
			};
			const despawn_collection = {
				gameId: 0,
				collected: false
			}
			for (const key in idStorage) {
				switch (idStorage[key]) {
					case "collection": 
					despawn_collection.gameId = parseInt(key); 
					dispatch.toClient('S_DESPAWN_COLLECTION', 2, despawn_collection); 
					break;
					case "item": 
					despawn_event.gameId = parseInt(key);  
					dispatch.toClient('S_DESPAWN_DROPITEM', 4, despawn_event); 
					break;
					case "build_object": 
					despawn_event.gameId = parseInt(key);  
					dispatch.toClient('S_DESPAWN_BUILD_OBJECT', 2, despawn_event); 
					break;
					default: return debug_message(true, "Invalid sub_type for despawn handler:", event['sub_type']);
				}
			}
			for (let key in timers) clearTimeout(timers[key]);
			timers = {};
			idStorage = {};
		}
		// Text handler
		function text_handler(event, ent, speed = 1.0) {
			// Fetch the message
			const message = event[`message_${language}`] || event[`message_${language.toUpperCase()}`] || event['message'];
			// Make sure sub_type is defined
			if (!event['sub_type']) return debug_message(true, "Text handler needs a sub_type");
			// Make sure message is defined
			if (!message) return debug_message(true, "Text handler needs a message");
			let sending_event = {};
			// Create the sending event
			switch(event['sub_type']) {
				// Mixed notice
				case "message": {
					if (!entered_zone_data.verbose && !is_event) return;
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					timers[event['id'] || random_timer_id--] = setTimeout(()=> {
						sendMessage(message);
					}, (event['delay'] || 0) / speed);
					break;
				}
				// Pink dungeon event message
				case "msgcp": {
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					timers[event['id'] || random_timer_id--] = setTimeout(()=> {
						sendspMessage(message, cp);
					}, (event['delay'] || 0) / speed);
					break;
				}
				// Green dungeon event message
				case "msgcg": {
					if (!entered_zone_data.verbose && !is_event) return;
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					timers[event['id'] || random_timer_id--] = setTimeout(()=> {
						sendspMessage(message, cg);
					}, (event['delay'] || 0) / speed);
					break;
				}
				// Team leader notice
				case "alert": {
					if (!entered_zone_data.verbose && !is_event) return;
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					if (dispatch.settings.stream) {
						command.message(dispatch.settings.cc + message);
						return;
					}
					sending_event = {
						channel: 21,
						authorName: 'guide',
						message
					};
					break;
				}
				// Raid leader notice
				case "notification": {
					if (!entered_zone_data.verbose && !is_event) return;
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					if (dispatch.settings.stream) {
						command.message(dispatch.settings.cc + message);
						return;
					}
					sending_event = {
						channel: 25,
						authorName: 'guide',
						message
					};
					break;
				}
				// Voice announcement
				case "speech": {
					if (!entered_zone_data.verbose && !is_event) return;
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					break;
				}
				case "MSG": {
					if (!entered_zone_data.verbose && !is_event) return;
					if (voice && dispatch.settings.speaks) {
						timers[event['id'] || random_timer_id--] = setTimeout(()=> {
							voice.speak(message, dispatch.settings.rate);
						}, (event['delay'] || 0 ) - 600 / speed);
					}
					if (dispatch.settings.stream) {
						command.message(dispatch.settings.cc +  message);
						return;
					}
					timers[event['id'] || random_timer_id--] = setTimeout(()=> {
						command.message(cr + message);
						console.log(cr + message);
					}, (event['delay'] || 0 ) - 600 / speed);
					break;
				}
				// Color-specified proxy channel messages
				case "COMSG": {
					command.message(co + message);
					break;
				}
				case "CYMSG": {
					command.message(cy + message);
					break;
				}
				case "CGMSG": {
					command.message(cg + message);
					break;
				}
				case "CDBMSG": {
					command.message(cdb + message);
					break;
				}
				case "CBMSG": {
					command.message(cb + message);
					break;
				}
				case "CVMSG": {
					command.message(cv + message);
					break;
				}
				case "CPMSG": {
					command.message(cp + message);
					break;
				}
				case "CLPMSG": {
					command.message(clp + message);
					break;
				}
				case "CLBMSG": {
					command.message(clb + message);
					break;
				}
				case "CBLMSG": {
					command.message(cbl + message);
					break;
				}
				case "CGRMSG": {
					command.message(cgr + message);
					break;
				}
				case "CWMSG": {
					command.message(cw + message);
					break;
				}
				case "CRMSG": {
					command.message(cr + message);
					break;
				}
				// Default color proxy channel message
				case "PRMSG": {
					command.message(dispatch.settings.cc + message);
					break;
				}
				default: {
					return debug_message(true, "Invalid sub_type for text handler:", event['sub_type']);
				}
			}
			// Create the timer
			timers[event['id'] || random_timer_id--] = setTimeout(()=> {
				switch(event['sub_type']) {
					case "notification": return dispatch.toClient('S_CHAT', 3, sending_event);
					case "alert": return dispatch.toClient('S_CHAT', 3, sending_event);
				}
			}, (event['delay'] || 0 ) / speed);
		}
		// Mixed notice message
		function sendMessage(message) {
			if (dispatch.settings.stream) {
				command.message(dispatch.settings.cc + message);
				return;
			}
			// Team leader notice
			if (dispatch.settings.notice) {
				dispatch.toClient('S_CHAT', 3, {
					channel: 21, //21 = p-notice, 1 = party, 2 = guild
					message
				});
			// Party notice
			} else if (dispatch.settings.systemNotice) {
				dispatch.toClient('S_CHAT', 3, {
					channel: 1, //21 = p-notice, 1 = party, 2 = guild
					message
				});
			// Dungeon event message
			} else {
				sendspMessage(message, dispatch.settings.cc);
			}
		}
		// Dungeon event message
		function sendspMessage(message, spcc) {
			if (dispatch.settings.stream) {
				command.message(dispatch.settings.cc + message);
				return;
			}
			dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 2, {
				type: 42,
				chat: 0,
				channel: 27,
				message: (spcc + message)
			});
		}
		// Stop timer handler
		function stop_timer_handler(event, ent, speed = 1.0) {
			// Make sure id is defined
			if (!event['id']) return debug_message(true, "Stop timer handler needs a id");
			// Check if that entry exists, if it doesn't print out a debug message. This is because users can make mistakes
			if (!timers[event['id']]) return debug_message(true, `There isn't a timer with tie id: ${event['id']} active`);
			// clearout the timer
			clearTimeout(timers[event['id']]);
		}
		// Func handler
		function func_handler(event, ent, speed = 1.0) {
			// Make sure func is defined
			if (!event['func']) return debug_message(true, "Func handler needs a func");
			// Start the timer for the function call
			timers[event['id'] || random_timer_id--] = setTimeout(event['func'], (event['delay'] || 0) / speed, function_event_handlers, event, ent, fake_dispatch);
		}
	}
}

module.exports = TeraGuide;