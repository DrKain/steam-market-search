var SteamMarket = require('../index');


// Search CSGO for P90 skins
SteamMarket.search("730", { find : "P90 Death by Kitty" }).then(function(items){
    console.log(JSON.stringify(items[0], null, 2));
}, console.error);

/*
{
  "name": "StatTrak™ P90 | Death by Kitty (Minimal Wear)",
  "hash_name": "StatTrak™ P90 | Death by Kitty (Minimal Wear)",
  "sell_listings": 5,
  "sell_price": 147.43,
  "app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg",
  "app_name": "Counter-Strike: Global Offensive",
  "asset_description": {
    "appid": 730,
    "classid": "994716821",
    "instanceid": "188531370",
    "background_color": "",
    "name_color": "CF6A32"
  },
  "sale_price": 141.02,
  "type": "StatTrak™ Covert SMG",
  "image": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17PDJZS5J-dC6h7-bzqfLP7LWnn8fuMN32OqU9tmmiQLt-hZuaz2mJITGJgFsZViF-Vi7levs0Z7vupXLz2wj5HegSjteqg",
  "link": "https://steamcommunity.com/market/listings//730/StatTrak%E2%84%A2%20P90%20%7C%20Death%20by%20Kitty%20(Minimal%20Wear)"
}

*/