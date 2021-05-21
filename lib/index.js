"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.market = exports.SteamMarket = void 0;
var https_1 = require("https");
var SteamMarket = /** @class */ (function () {
    function SteamMarket() {
        this.debug = false;
        this.$market = 'https://steamcommunity.com/market/search/render/';
        this.$image = 'https://steamcommunity-a.akamaihd.net/economy/image/';
        this.reqOptions = {};
        this.defaults = {};
        return this;
    }
    /**
     * Merges category filters into a single value to allow filtering
     * of multiple category types at once.
     * @param key Category Type
     * @param arr Array
     */
    SteamMarket.prototype.mergeArray = function (key, arr) {
        var strs = [];
        arr.forEach(function (alt) { return strs.push(key + "=" + alt); });
        return strs.join('&');
    };
    /**
     * Convert an object into a browser-friendly query.
     * { one: 'two', three: 'four' } becomes ?one=two&three=four
     * @param obj Object
     */
    SteamMarket.prototype.querystring = function (obj) {
        var _this = this;
        return Object.keys(obj)
            .map(function (key, index) {
            var prefix = index !== 0 ? '&' : '?';
            return prefix + (Array.isArray(obj[key]) ? _this.mergeArray(key, obj[key]) : key + "=" + obj[key]);
        })
            .join('');
    };
    /**
     * Generate a querystring using defaults overwritten by search options
     * @param options SearchOptions
     */
    SteamMarket.prototype.getQuery = function (options) {
        // Replace spaces with +
        options.query = this.space(options.query);
        return this.querystring(__assign(__assign({ start: 0, count: 50, search_descriptions: 0, sort_column: 'price', sort_dir: 'desc', norender: 1 }, this.defaults), options));
    };
    /**
     * Handle the response received after call()ing the API
     * This checks for simple errors and/or a malformed response
     * @param res http response
     */
    SteamMarket.prototype.handle = function (res) {
        return new Promise(function (resolve, reject) {
            var body = '';
            res.on('data', function (chunk) { return (body += chunk); });
            res.on('end', function () {
                try {
                    var data = JSON.parse(body);
                    if (!res.statusCode) {
                        return reject(new Error('Status code not received'));
                    }
                    if (res.statusCode !== 200) {
                        return reject(new Error('Bad Status Code: ' + res.statusCode));
                    }
                    if (data.success !== true) {
                        return reject(data);
                    }
                    resolve(data.results);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    };
    /**
     * Send a request to the target URL.
     * @param url Full API URL
     */
    SteamMarket.prototype.call = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            if (_this.debug)
                console.log("call() " + url);
            https_1.get(url, (_a = _this.reqOptions) !== null && _a !== void 0 ? _a : {}, function (res) { return _this.handle(res).then(resolve, reject); });
        });
    };
    /**
     * Replace spaces with + to be used in URLs
     * @param str String
     */
    SteamMarket.prototype.space = function (str) {
        return str.split(' ').join('+');
    };
    /**
     * Set custom headers to be used in the request
     * See https://nodejs.org/api/http.html#http_http_request_url_options_callback
     * @param obj Any
     */
    SteamMarket.prototype.setHeaders = function (obj) {
        this.reqOptions.headers = obj;
    };
    /**
     * Set custom request options that will be used in each request
     * See https://nodejs.org/api/http.html#http_http_request_url_options_callback
     * @param obj RequestOptions
     */
    SteamMarket.prototype.setRequestOptions = function (obj) {
        this.reqOptions = obj;
    };
    /**
     * Use with caution! This will set the default options for
     * each request.
     * To reset simply use useDefaults({});
     *
     * The options passed during a search will still overwrite these
     * defaults.
     * @param obj SearchOptions
     */
    SteamMarket.prototype.useDefaults = function (obj) {
        this.defaults = obj;
    };
    /**
     * Search the Steam Community Marketplace for items.
     * @param appid AppID of the game you want to search. Use 753 for Steam items like trading cards
     * @param options Search Options. Requires *at least* { query: 'Search Query' }
     */
    SteamMarket.prototype.search = function (appid, options) {
        var _this = this;
        if (typeof options === 'string')
            options = { query: options };
        return new Promise(function (resolve, reject) {
            var query = _this.getQuery(__assign(__assign({}, options), { appid: appid }));
            _this.call(_this.$market + query).then(resolve, reject);
        });
    };
    /**
     * Shortcut to search CSGO for items
     * @param options Search Options
     */
    SteamMarket.prototype.searchCSGO = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof options === 'string')
                options = { query: options };
            return _this.search(730, options).then(resolve, reject);
        });
    };
    /**
     * Shortcut to search TF2 for items
     * @param options Search Options
     */
    SteamMarket.prototype.searchTF2 = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof options === 'string')
                options = { query: options };
            return _this.search(440, options).then(resolve, reject);
        });
    };
    /**
     * Search for items like trading cards, booster packs, emoticons or backgrounds.
     * @param options SearchOptions
     */
    SteamMarket.prototype.searchCommunity = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof options === 'string')
                options = { query: options };
            return _this.search(753, options).then(resolve, reject);
        });
    };
    return SteamMarket;
}());
exports.SteamMarket = SteamMarket;
/**
 * Precreated instance of the SteamMarket.
 */
exports.market = new SteamMarket();
