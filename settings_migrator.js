"use strict"
const DefaultSettings = {
	"enabled": true,
	"systemNotice": false,
	"notice": true,
	"stream": false,
	"spawnObject": true,
	"speaks": false,
	"rate": [
		2
	],
	"dungeons": [
		{"id": 3020, "name": "Sea of Honor", "name_RU": "Золотая чешуя", "verbose": true, "spawnObject": true},
		{"id": 3023, "name": "Akalath Quarantine", "name_RU": "Секретное подземелье крепости Берарк", "verbose": true, "spawnObject": true},
		{"id": 3026, "name": "Corrupted Skynest", "name_RU": "Логово Келсаика", "verbose": true, "spawnObject": true},
		{"id": 3027, "name": "Forbidden Arena", "name_RU": "Арена безумия", "verbose": true, "spawnObject": true},
		{"id": 3101, "name": "Gossamer Vault", "name_RU": "Гнездо Паркин", "verbose": true, "spawnObject": true},
		{"id": 3102, "name": "Draakon Arena", "name_RU": "", "verbose": true, "spawnObject": true},
		{"id": 3126, "name": "Corrupted Skynest (Hard)", "name_RU": "Логово Бессмертного Келсаика", "verbose": true, "spawnObject": true},
		{"id": 3201, "name": "Gossamer Vault (Hard)", "name_RU": "Гнездо сверкающей Паркин", "verbose": true, "spawnObject": true},
		{"id": 3202, "name": "Draakon Arena (Hard)", "name_RU": "", "verbose": true, "spawnObject": true},
		{"id": 9044, "name": "Bahaar's Sanctum", "name_RU": "Святилище Бахаара", "verbose": true, "spawnObject": true},
		{"id": 9067, "name": "Demokron Factory (Hard)", "name_RU": "Лаборатория Берна (сложно)", "verbose": true, "spawnObject": true},
		{"id": 9720, "name": "Antaroth's Abyss", "name_RU": "Омут Антароса", "verbose": true, "spawnObject": true},
		{"id": 9735, "name": "RK-9 Kennel", "name_RU": "Ангар RK-9", "verbose": true, "spawnObject": true},
		{"id": 9781, "name": "Velik's Sanctuary", "name_RU": "Святилище Велики", "verbose": true, "spawnObject": true},
		{"id": 9782, "name": "Grotto of Lost Souls", "name_RU": "Мастерская Леандра", "verbose": true, "spawnObject": true},
		{"id": 9920, "name": "Antaroth's Abyss (Hard)", "name_RU": "Омут Бездушного Антароса", "verbose": true, "spawnObject": true},
		{"id": 9935, "name": "RK-9 Kennel (Hard)", "name_RU": "Ангар совершенного RK-9", "verbose": true, "spawnObject": true},
		{"id": 9970, "name": "Ruinous Manor (Hard)", "name_RU": "Руины Кошмарной Абнукты", "verbose": true, "spawnObject": true},
		{"id": 9981, "name": "Velik's Sanctuary (Hard)", "name_RU": "Разрушенное Святилище Велики", "verbose": true, "spawnObject": true},
		{"id": 9982, "name": "Grotto of Lost Souls (Hard)", "name_RU": "Заброшенная мастерская Леандра", "verbose": true, "spawnObject": true}
	],
	"cc": [
		"</font><font color=\"#ffff00\">"
	],
	"chat-name": "Guide"
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) {
		// Migrate legacy config file
		return Object.assign(Object.assign({}, DefaultSettings), settings);
	} else if (from_ver === null) {
		// No config file exists, use default settings
		return DefaultSettings;
	} else {
		// Migrate from older version (using the new system) to latest one
		if (from_ver + 1 < to_ver) {
			// Recursively upgrade in one-version steps
			settings = MigrateSettings(from_ver, from_ver + 1, settings);

			setTimeout(function(){ 
					return MigrateSettings(from_ver + 1, to_ver, settings); 
			}, 0);
		}
		// If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
		// a switch for each version step that upgrades to the next version. This enables us to
		// upgrade from any version to the latest version without additional effort!
		switch (to_ver) {
			default:
				let oldsettings = settings;
				settings = Object.assign(DefaultSettings, {});
				for (let option in settings) {
					if (option == "dungeons") {
						let optionobj = [];
						for (let i of settings[option]) {
							if (i.id == undefined) continue;
							if (oldsettings[option]) {
								for (const oldi of oldsettings[option]) {
									if (oldi.id == i.id) {
										i = oldi;
										break;
									}
								}
							}
							optionobj.push(i);
						}
						settings[option] = optionobj;
					}
				}
				for (let option in oldsettings) {
					if (option == "dungeons") continue;
					if (settings[option]) {
						settings[option] = oldsettings[option];
					}
				}
				break;
		}
		return settings;
	}
}