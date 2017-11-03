var SteamMarket = require('../index');

// 311210 = Call of Duty: Black Ops III

SteamMarket.getItems({ appid : 311210 }, function(err, res){
    console.log( JSON.stringify(res[0], null, 2) );
});
