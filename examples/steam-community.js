var SteamMarket = require("../index");

// 311210 = Call of Duty: Black Ops III
SteamMarket.searchCommunity("311210").then(console.log, console.warn);