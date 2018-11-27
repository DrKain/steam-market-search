var SteamMarket = require('../index');

// 311210 = Call of Duty: Black Ops III

// Search for community items like emoticons, trading cards, backgrounds and boosters
SteamMarket.searchCommunity("311210").then(function(items){
    console.log(JSON.stringify(items[0], null, 2));
}, console.error);

/*

{
  "name": "Seraph (Foil Trading Card)",
  "hash_name": "311210-Seraph (Foil Trading Card)",
  "sell_listings": 75,
  "sell_price": 0.28,
  "app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/753/135dc1ac1cd9763dfc8ad52f4e880d2ac058a36c.jpg",
  "app_name": "Steam",
  "asset_description": {
    "appid": 753,
    "classid": "1381041092",
    "instanceid": "0",
    "background_color": "",
    "name_color": ""
  },
  "sale_price": 0.27,
  "type": "Trading Card",
  "rarity": "Foil",
  "image": "https://steamcommunity-a.akamaihd.net/economy/image/IzMF03bk9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdA3g5gMEPvUZZEaiHLrVJRsl8vGuCUY7Cjc9ehDNVzDMFe3OqjCQrcex4NM6b8wDpoPKFWn36aTDBcnaPGQ0_T-UMN2HdqjOj4b6dQWnLErl_RQ8DKPYN9jBJaZ2KPhE5048Vu2u_0UZyDBItYPpPfQ68zykSYbx2kCIQcshXniylcJze0Fxkbk47X-viAOiTaNKklnwlWkxnS6EYesvL7zOq9ZYnnv61ww",
  "link": "https://steamcommunity.com/market/listings//753/311210-Seraph%20(Foil%20Trading%20Card)"
}

 */