steam-market-search
============

[![NPM](https://nodei.co/npm/steam-market-search.png?downloads=true)](https://nodei.co/npm/steam-market-search/)

**What is this?**  
------------
steam-market-search is a NodeJS package for retrieving market information of steam community items for a certain app.
These items are Emoticons, Backgrounds, Trading cards and Booster Packs.

Quick Start
--------------

**Install in your app directory**

```shell
$ npm install steam-market-search --save
```

**Basic usage**
```javascript
var SteamMarketSearch = require('../index');

// 311210 = Call of Duty: Black Ops III

SteamMarketSearch("311210").then(function(items){

    // Print all items found
    console.log(JSON.stringify(items, null, 2));

}, function(err){

    console.log("Error : " + err);

});
```

**Output:**

```json
{
        "name": "Stronghold",
        "hash_name": "311210-Stronghold",
        "sell_listings": 771,
        "sell_price": 0.04,
        "sale_price_text": "$0.03",
        "appid": 753,
        "item_type": "Trading Card",
        "image": "https://steamcommunity-a.akamaihd.net/economy/image/IzMF03bk9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdA3g5gMEPvUZZEaiHLrVJRsl8vGuCUY7Cjc9ehDNVzDMFe3OqjCQrcex4NM6b8xHpruyKFHv7bHHNIiDeGQNqHrRdNGiP-Wak4bydQzHAF-4rQ1tWdaYC-20bbMiOPkc-gI8D_Gfh2VRzGVAqfddCdR2Ew3kSNrh4kXdCfJtRzCD3JJyP1A5jPhJoC7jvX7jFbIPwlSx3DhJjTKFIbImVvTuspsDnLPqHZlWIYvE",
        "link": "https://steamcommunity.com/market/listings/753/311210-Stronghold"
}
```

**Filtering Results**

```javascript

var emoticons = items.filter(function(a){ return a.type === "Emoticon"; });

```

**Rate limits**

Avoid making too many requests to the marketplace in a short time, Steam will throttle the amount of queries you can make every minute.


**Additional Notes**

- Please report any issues [here](https://github.com/DrKain/SteamMarketSearch/issues)