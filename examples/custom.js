var SteamMarket = require("../index");

// 578080 - Playerunknown's Moneygrab
SteamMarket.search("578080", { find : "Trenchcoat" }).then(console.log, console.warn);