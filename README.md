steam-market-search
============

[![NPM](https://nodei.co/npm/steam-market-search.png?downloads=true)](https://nodei.co/npm/steam-market-search/)

**What is this?**  
------------
steam-market-search is a NodeJS package for retrieving market information of steam community items for a certain app.
These items are Emoticons, Backgrounds, Trading cards and Booster Packs.

# 1.0.7 Large changes
------------
The 1.0.7 recode has changed how the page works, It's no longer limited to steamcommunity items. The structure has changed and it uses promises instead of callbacks.
Please read the mini documentation below to understand how to properly use this package.

Quick Start
--------------

**Install in your app directory**

```shell
$ npm install steam-market-search --save
```

**Basic usage**
```javascript
var SteamMarket = require('../index');

// 311210 = Call of Duty: Black Ops III

// Search for community items like emoticons, trading cards, backgrounds and boosters
SteamMarket.searchCommunity("311210").then(function(items){
    console.log(JSON.stringify(items[0], null, 2));
}, console.error);
```

**Output:**

```json
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
}, ...
```

**Searching non-community items**
Like CSGO, TF2, Dota ect.

```javascript
var SteamMarket = require('../index');

// Search CSGO for P90 skins
SteamMarket.search("730", { find : "P90 Death by Kitty" }).then(function(items){
    console.log(JSON.stringify(items[0], null, 2));
}, console.error);
```

**Multi-page Searches**

It's not recommended to use low multipage intervals. Making too many requests will get you rate-limited on steam.
Previous options will work fine.

```javascript
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
```

**Rate limits**
It's not recommended to use low multipage intervals. Making too many requests in a short amount of time will get you rate-limited on steam.

**Additional Notes**

- Please report any issues [here](https://github.com/DrKain/SteamMarketSearch/issues)