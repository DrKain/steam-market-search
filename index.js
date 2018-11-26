var querystring     = require('querystring');
var https           = require('https');

function call(url){
    return new Promise(function(resolve, reject){
        var items = [];

        https.get(url, function(res){
            var body = '';
            res.on('data', function(chunk){ body += chunk; });
            res.on('end', function(){
                var jdata = JSON.parse(body);
                jdata['results'].map(function(item){
                    var proc = Object.assign(item, {
                        appid       : item['asset_description']['appid'],
                        sell_price  : item.sell_price / 100, // 37 => 0.37
                        item_type   : discoverItemType(item['asset_description']['type']), // Clearer types
                        image       : 'https://steamcommunity-a.akamaihd.net/economy/image/' + item['asset_description']['icon_url'],
                        link        : 'https://steamcommunity.com/market/listings/753/' + encodeURIComponent(item['asset_description']['market_hash_name'])
                    });
                    // The following is to clean up the object and remove item-specific data that will change depending on the cheapest listing
                    delete proc['app_icon']; // Always same
                    delete proc['app_name']; // Always same
                    delete proc['sell_price_text']; // Unnecessary
                    delete proc['asset_description']; // Unnecessary
                    // Explained below:
                    function nocall(){
                        delete proc['asset_description']['type']; // Not clear enough
                        delete proc['asset_description']['appid']; // Duplicated value
                        delete proc['asset_description']['classid']; // Unreliable due to change
                        delete proc['asset_description']['icon_url']; // Not needed with proc.image
                        delete proc['asset_description']['tradable']; // Unnecessary
                        delete proc['asset_description']['instanceid']; // Unnecessary
                        delete proc['asset_description']['name_color']; // Empty values
                        delete proc['asset_description']['market_hash_name']; // Duplicated value
                        delete proc['asset_description']['background_color']; // Empty values
                    }
                    items.push(proc);
                });
                resolve(items);
            });
        }).on('error', reject);

    });
}

function discoverItemType(name){
    if(name === "Booster Pack") return "Booster Pack";
    if(name.indexOf("Trading Card") > -1) return "Trading Card";
    if(name.indexOf("Emoticon") > -1) return "Emoticon";
    if(name.indexOf("Profile Background") > -1) return "Background";
    return name;
}

function getMarketItems(appid){
    return new Promise(function(resolve, reject){
        // Build url parameters
        var options = querystring.stringify({
            query : '', start : '0',
            // No game has more than 50 items, Multi page is not required
            count : '50', search_descriptions : 0,
            sort_column : 'price', sort_dir : 'desc',
            // This is the appid for steam, Do no change it
            appid : '753',
            // Appid of the items we are searching for
            'category_753_Game[]' : 'tag_app_' + appid,
            norender : 1
        });
        call('https://steamcommunity.com/market/search/render/?' + options).then(resolve, reject);
    });
}

module.exports = getMarketItems;