var SteamMarket = require('../index');

// Load 3 pages of Minimal Wear P90 Skins for CSGO

SteamMarket.searchMultipage("730", {
    find : "P90 Minimal Wear",
    multipage_amount : 3, // Load 3 pages then return results. Default=10
    multipage_interval : 3000, // Wait 3 seconds between pages. Default=3000
    multipage_logging : true // Log progress
}).then(function(items){

    // Console log all items found worth $1.00 - $5.00
    console.log( items.filter(function(a){
        return a.sale_price > 1.00 && a.sale_price < 5.00
    }) );

}, console.error);