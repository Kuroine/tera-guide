# tera-guide
A generic guide module for TERA with English and Russian translations (detects automaticly). Display hints on screen and drawing zones of bosses attacks and mechanics. Supports of all actual dungeons.

## Dependencies
https://github.com/tera-toolbox-mods/library

Extract to "mods" directory in your Tera-Proxy. DO NOT INSTALLED IT AS "library-master" MAKE SURE IT'S NAMED "library".

## Commands
Toolbox(/8) | Command description
--- | --- | ---
guide | Module on/off
guide&nbsp;voice | Text-to-speech (TTS) notices on/off, speech rate is set in the `rate` param in `config.json` |
guide&nbsp;alert | Send notices to chat channel "Notice" instead of on-screen messages on/off (notices for the "Raid Notice" channel work regardless of this setting) |
guide&nbsp;systemNotice | Send notices to party chat channel on/off (will be visible for all party members) |
guide&nbsp;spawnObject | Spawn marker objects on/off |
guide&nbsp;stream | Streamer mode on/off (hide all notices and objects, TTS will played) |
guide&nbsp;dungeons | List of all supported dungeons and its ids |
guide&nbsp;verbose&nbsp;`id` | Send notices for specified by `id` dungeon on/off |
guide&nbsp;spawnObject&nbsp;`id` | Spawn marker objects for specified by `id` dungeon on/off |
guide&nbsp;help | List of supported commands |

## Supported Dungeons
id | Dungeon Name
--- | ---
9781 | Velik's Sanctuary
9735 | RK-9 Kennel
9920 | Antaroth's Abyss (Hard)
9982 | Grotto of Lost Souls (Hard)
9044 | Bahaar's Sanctum
3201 | Gossamer Vault (Hard)
3023 | Akalath Quarantine
3020 | Sea of Honor
3026 | Corrupted Skynest
3126 | Corrupted Skynest (Hard)
3027 | Forbidden Arena
3102 | Draakon Arena
3202 | Draakon Arena (Hard)

## Development and debugging
 Details: https://github.com/Kuroine/tera-guide/wiki

## Credits
- michengs - https://github.com/michengs/Dungeon-guide and https://github.com/michengs/tera-guide
- ZC - https://github.com/tera-mod/TERA-Guide and https://github.com/tera-mod/TERA-Guide-Area
- Kasea - https://github.com/tera-toolbox-mods/tera-guide
- ITunk - https://github.com/GrafNikola
- Owyn - https://github.com/Owyn
- hsdn - https://github.com/hsdn/tera-guide
