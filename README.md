steam-market-search
============

[![NPM](https://nodei.co/npm/steam-market-search.png?downloads=true)](https://nodei.co/npm/steam-market-search/)

**What is this?**  
------------
A NodeJS package for searching the steam marketplace

# 1.1.2 changes
------------
It looks like the steam market changed and this package broke, So I've recoded it from scratch. Response cleaning is now optional. Use `searchTF2` and `searchCSGO` for the cleaned responses, Otherwise just use `search("730", options)`.

Quick Start
--------------

**Install in your app directory**

```shell
$ npm install steam-market-search --save
```
then
```javascript
var SteamMarket = require("steam-market-search");
```

# Search CSGO
CSGO weapons, skins, knives and such. For trading cards use `searchCommunity`
```javascript
SteamMarket.searchCSGO({ find : 'Death by Kitty' }).then(console.log, console.warn);
```

# Search TF2
TF2 weapons, skins, hats and paints. For trading cards use `searchCommunity`
```javascript
SteamMarket.searchTF2({ find : 'Pride Scarf' }).then(console.log, console.warn);
```

# Search Steam Community
All community items. These are trading cards, booster packs, gems, emoticons, backgrounds.
```javascript
// 311210 = Call of Duty: Black Ops III
SteamMarket.searchCommunity("311210").then(console.log, console.warn);
```

# Search custom
Search for items by another game, IE - Playerunknown's Battlegrounds.
``javascript
SteamMarket.search("578080", { find : "Trenchcoat" }).then(console.log, console.warn);
```


- Please report any issues [here](https://github.com/DrKain/SteamMarketSearch/issues)