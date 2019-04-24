var SteamMarket = require("../index");

SteamMarket.searchCSGO({ find : 'Death by Kitty' }).then(console.log, console.warn);