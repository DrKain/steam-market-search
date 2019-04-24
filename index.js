var https       = require('https');
var cleaners    = require("./cleaner");

function call(url){
    return new Promise(function(resolve, reject){
        console.log( url );
        https.get(url, function(res){
            var body = '';
            res.on('data', function(chunk){ body += chunk; });
            res.on('end', function(){
                var jData = JSON.parse(body);
                if(res['statusCode'] === 200 && jData['success'] === true){
                    resolve(jData['results']);
                } else reject({ success: false, status : res['statusCode'] });
            });
        }).on('error', reject);
    });
}

function handleUniqueApps(obj){
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
}

function queryString(obj){
    obj = handleUniqueApps(obj);
    return Object.keys(obj).map(function(v, i){
        return (i!==0?'&':'?')+`${v}=${obj[v]}`;
    }).join('');
}

function generateQueryObject(options, appid, game_appid){
    return queryString( Object.assign({
        currency : 3, // USD
        query : '', start : 0,
        count : 50, search_descriptions : 0,
        sort_column : 'price', sort_dir : 'desc',
        appid : appid,
        game_appid : game_appid ? game_appid : null,
        norender : 1
    }, options || {}) );
}

function search(appid, game_appid, options){
    if(typeof game_appid === "object"){
        options = game_appid;
        game_appid = undefined;
    }
    return new Promise(function(resolve, reject){
        call(`https://steamcommunity.com/market/search/render/${ generateQueryObject(options, appid, game_appid) }`).then(resolve, reject);
    });
}

function clean(appid, items){
    return cleaners[appid] ? cleaners[appid](items) : items;
}

module.exports = {
    // Shortcuts & Cleaners
    searchCommunity : function(appid, options){
        var self = this;
        return new Promise(function(resolve, reject){
            self.search(753, appid, options).then(resolve, reject);
        });
    },
    searchCSGO : function(options){
        return new Promise(function(resolve, reject){
            search("730", options).then(function(items){
                resolve(clean('730', items))
            }, reject);
        })
    },
    searchTF2: function (options) {
        return new Promise(function (resolve, reject) {
            search("440", options).then(function (items) {
                resolve(clean('440', items))
            }, reject);
        })
    },
    // Regular Searches
    search : search
};