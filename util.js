var Util = {};

Util.priceToNum = function(str){
    return Number(str.replace(/[^0-9.-]+/g,""));
};

Util.toimageURL = function(str){
    return "https://steamcommunity-a.akamaihd.net/economy/image/" + str;
};

module.exports = Util;