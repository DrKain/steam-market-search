var querystring = require('querystring');
var request = require('request');
var htmlToJson = require('html-to-json');

function tryParseResponse(input) {
    try {
        return JSON.parse(input);
    } catch (e) {
        return {};
    }
}

function proxyCall(url, callback) {
    // TODO: This
}

function call(url, callback) {
    request(url, function (e, r, b) {
        if (e) return callback(e, null);
        callback(null, tryParseResponse(b));
    });
}

function parseHTML(input, callback) {
    htmlToJson.parse(input, function () {
        return this.map('.market_listing_row_link', function ($item) {
            return {
                item_name: $item.find('.market_listing_item_name').text(),
                game_name: $item.find('.market_listing_game_name').text(),
                price: {
                    currency: '',
                    normal_price: $item.find('.market_table_value span.normal_price').text(),
                    sale_price: $item.find('.market_table_value span.sale_price').text()
                },
                link: $item.attr('href'),
                image: $item.find('img').attr('src'),
                type: 'Unknown'
            };
        });
    }).done(function (listings) {
        callback(null, getItemTypes(listings));
    }, function (err) {
        callback(err, null);
    });
}

function getItemTypes(list) {
    var curr = '';
    var toNum = function (nums) {
        if (curr === '') curr = nums.split(' ').pop();
        return Number(nums.replace(/[^0-9\.-]+/g, ""));
    };
    return list.filter(function (item) {
        var name = item['game_name'];
        if (name === 'Booster Pack') item.type = 'Booster Pack';
        if (name.indexOf('Trading Card') > -1) item.type = 'Trading Card';
        if (name.indexOf('Emoticon') > -1) item.type = 'Emoticon';
        if (name.indexOf('Profile Background') > -1) item.type = 'Background';
        item.price.normal_price = toNum(item.price.normal_price);
        item.price.sale_price = toNum(item.price.sale_price);
        item.price.currency = curr;
        return item;
    });
}

function getMarketItems(o, callback) {
    if (typeof o === "string") o = {appid: o};
    if (typeof o.appid === "undefined") return callback("Missing AppID", null);
    var options = {
        query: '',
        start: '0',
        count: '50',
        search_descriptions: 0,
        sort_column: 'price',
        sort_dir: 'desc',
        appid: '753',
        'category_753_Game[]': 'tag_app_' + o.appid
    };
    delete o.appid;
    call('http://steamcommunity.com/market/search/render/?' + querystring.stringify(Object.assign(options, o)), function (err, res) {
        if(Object.keys(res).length === 0) return callback({ success : false, message : "API Lockout!" }, null);
        if (res['success'] === false) return callback({success: false}, null);
        parseHTML(res['results_html'], function (e, r) {
            if (r.length === 0) e = "No Items. AppID might be incorrect.";
            callback(e, r);
        });
    });
}

function getMarketType(o, types, callback) {
    if (typeof types === 'string') types = [types];
    getMarketItems(o, function (err, res) {
        if (err) callback(err, null);
        else {
            callback(null, res.filter(function (item) {
                return types.indexOf(item.type) > -1;
            }));
        }
    });
}


module.exports = {
    getItems: getMarketItems,
    // For lazy people
    getMarketType: getMarketType,
    getEmoticons: function (o, callback) {
        getMarketType(o, 'Emoticon', callback);
    },
    getBackgrounds: function (o, callback) {
        getMarketType(o, 'Background', callback);
    },
    getCards: function (o, callback) {
        getMarketType(o, 'Trading Card', callback);
    }
};