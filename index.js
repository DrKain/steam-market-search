var https           = require('https');

module.exports = {
    urls : {
        market_render   : "https://steamcommunity.com/market/search/render/",
        listing         : "https://steamcommunity.com/market/listings/",
        image           : "https://steamcommunity-a.akamaihd.net/economy/image/"
    },
    regex_store : {
        csgo_wear   : /(Factory New|Minimal Wear|Field-Tested|Battle-Scarred|Well-Worn|Not Painted)/g,
        type        : /(Booster Pack|Trading Card|Emoticon|Profile Background)/g,
        rarity      : /(Uncommon|Rare|Extraordinary|Precious|Common)/g
    },
    call : function(url){
        var self = this;
        return new Promise(function(resolve, reject){
            var response = [];

            https.get(url, function(res){
                var body = '';
                res.on('data', function(chunk){ body += chunk; });
                res.on('end', function(){
                    var jData = JSON.parse(body);
                    if(res['statusCode'] === 200 && jData['success'] === true){
                        jData['results'].map(function(item){
                            response.push(self.compileItem(item));
                        });
                        resolve(response);
                    } else reject({ success: false, status : res['statusCode'] });
                });
            }).on('error', reject);

        });
    },
    compileItem : function(item){
        // Conver sell and sale prices to floats
        item.sell_price = item.sell_price / 100;
        item.sale_price = Number(item['sale_price_text'].replace(/[^0-9.-]+/g,""));
        // Define type and item rarity
        item.type       = this.discoverItemValue(item['asset_description']['type'], "type");
        item.rarity     = this.discoverItemValue(item['asset_description']['type'], "rarity");
        // Linkify listing and icons
        item.image      = this.urls.image + (item['asset_description']['icon_url_large'] || item['asset_description']['icon_url']);
        item.link       = `${this.urls.listing}/${item['asset_description']['appid']}/${encodeURIComponent(item['asset_description']['market_hash_name'])}`;
        // Trading card foil?
        if(item.type === "Trading Card")
            item.rarity = item.name.indexOf("Foil Trading Card") > -1 ? "Foil" : "Normal";

        // Counter-Strike: Global Offensive
        if(item['asset_description']['appid'] === 730){
            delete item.rarity; // item.wear instead
            var desc        = item['asset_description']['descriptions'] || [];
            var actions     = item['asset_description']['market_actions'] || item['asset_description']['actions'] || [];
            item.wear       = this.discoverItemValue(item.name, "csgo_wear");
            item.inspect    = this.searchDescriptions("Inspect in Game...", "name", actions, null, "link").shift();
        }

        return this.cleanValues(item);
    },
    searchDescriptions : function(find, key, arr, regex, returnKey){
        var self = this;
        return arr.map(function(a){
            if(a[key].indexOf(find) > -1)
                return regex ? self.discoverItemValue(a[key], regex) : returnKey ? a[returnKey] : a[key];
        })
    },
    cleanValues : function(item){
        // Clean up steam values
        delete item['asset_description']['market_name'];
        delete item['asset_description']['name'];
        delete item['asset_description']['market_hash_name'];
        delete item['asset_description']['tradable'];
        delete item['asset_description']['icon_url'];
        delete item['asset_description']['type'];
        delete item['sell_price_text'];
        delete item['sale_price_text'];

        // CSGO Cleanup
        if(item['asset_description']['appid'] === 730) {
            delete item['asset_description']['icon_url_large']; // Already used and linkified
            delete item['asset_description']['descriptions']; // Already used
            delete item['asset_description']['market_actions']; // Already Used
            delete item['asset_description']['actions']; // Already Used
        }
        // Undefined
        if(item.inspect === undefined) delete item.inspect; // some items cannot be inspected
        // Return
        return item;
    },
    discoverItemValue : function(str, reg){
        return (str.match(this.regex_store[reg]) || [str]).shift();
    },
    handleUniqueApps : function(obj){
        // Steam Community
        if(Number(obj.appid) === 753){
            obj['category_753_Game[]'] = 'tag_app_' + obj.game_appid;
        }
        // CSGO
        if(Number(obj.appid) === 730){
            obj['category_730_ItemSet[]'] = 'any';
            obj['category_730_ProPlayer[]'] = 'any';
            obj['category_730_StickerCapsule[]'] = 'any';
            obj['category_730_TournamentTeam[]'] = 'any';
            obj['category_730_Weapon[]'] = 'any';
        }
        // Searches
        if(obj.find){
            obj.q = encodeURIComponent(obj.find);
            obj.query = obj.q;
        }
        // Clean up
        delete obj.find;
        delete obj.game_appid;
        // Return
        return obj;
    },
    querystring : function(obj){
        obj = this.handleUniqueApps(obj);
        return Object.keys(obj).map(function(v, i){
            return (i!==0?'&':'?')+`${v}=${obj[v]}`;
        }).join('');
    },
    // Shortcut
    searchCommunity : function(appid, options){
        var self = this;
        return new Promise(function(resolve, reject){
            self.search(753, appid, options).then(resolve, reject);
        });
    },
    generateQueryObject : function(options, appid, game_appid){
        return Object.assign({
            currency : 3, // USD
            query : '', start : 0,
            count : 50, search_descriptions : 0,
            sort_column : 'price', sort_dir : 'desc',
            appid : appid,
            game_appid : game_appid ? game_appid : null,
            norender : 1
        }, options || {});
    },
    search : function(appid, game_appid, options){
        if(typeof game_appid === "object"){
            options = game_appid;
            game_appid = undefined;
        }
        var self = this;
        return new Promise(function(resolve, reject){
            var query = self.generateQueryObject(options, appid, game_appid);
            self.call(self['urls'].market_render + self.querystring(query)).then(resolve, reject);
        });
    },
    fetchMultipageOptions : function(obj){
         var mpo = {
             amount  : obj.multipage_amount || 10, // Number of pages to load
             interval: obj.multipage_interval || 3000, // Milliseconds between each page
             logging : obj.multipage_logging || false
         };
         delete obj.multipage_amount;   // Delete because we
         delete obj.multipage_logging;  // don't want them
         delete obj.multipage_interval; // in the query
         return [ mpo, obj ];
    },
    searchMultipage : function(appid, game_appid, options){
        // TODO: Clean this
        if(typeof game_appid === "object"){
            options = game_appid;
            game_appid = undefined;
        }
        var self = this;
        return new Promise(function(resolve, reject){
            var pref        = self.fetchMultipageOptions(options);
            options         = self.generateQueryObject(pref[1], appid, game_appid);

            var config      = pref[0];
            var collection  = [];
            var index       = 0;

            var nextPage = function(){
                if(index >= config['amount']) return resolve(collection);
                else loadPage(index++);
            };

            var loadPage = function(page){
                options.start = options.count * page;
                if(config.logging === true)
                    console.log(`[SteamMarketSearch] Multipage range=${options.start}-${options.start + options.count}, page=${page+1}`);
                self.search(appid, game_appid, options).then(function(items){
                    collection = collection.concat(items);
                    if(config.logging === true)
                        console.log(`[SteamMarketSearch] Multipage page=${page}, additems=${collection.length} +${items.length}`);
                    if(items === 0) index = 1e9; // If there are no more results
                    setTimeout(nextPage, config.interval);
                }, reject);
            };

            nextPage();
        })
    }
};