var SteamMarket = require('../index');

// 311210 = Call of Duty: Black Ops III

// Only get emoticons
SteamMarket.getEmoticons({ appid : 311210 }, function(err, res){
    console.log( 'Emoticons Returned: ', res.length );
});

// Emoticons and backgrounds
// Valid: Emoticon, Background, Booster Pack, Trading Card
SteamMarket.getMarketType({ appid : 311210 }, ['Emoticon', 'Background'], function(err, res){
    console.log( JSON.stringify(res, null, 2) );
});