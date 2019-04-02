var SteamMarket = require('../index');

SteamMarket.searchCommunity("730").then(function (items) {
    var sums = {};

    items.map(function(item){
        if(!sums[item.type]) sums[item.type] = {};
        if(!sums[item.type][item.rarity]) sums[item.type][item.rarity] = item.sell_price;
        else sums[item.type][item.rarity] = +(sums[item.type][item.rarity] + item.sell_price).toFixed(2);
    });

    console.log( JSON.stringify(sums, null, 2) );

});