import { get, RequestOptions } from 'https';
import { IncomingMessage } from 'http';
import { SearchOptions, SearchResult } from './interface';

export class SteamMarket {
    public debug = false;
    private $market = 'https://steamcommunity.com/market/search/render/';
    public $image = 'https://steamcommunity-a.akamaihd.net/economy/image/';
    private reqOptions: RequestOptions = {};
    private defaults: Partial<SearchOptions> = {};

    constructor() {
        return this;
    }

    /**
     * Merges category filters into a single value to allow filtering
     * of multiple category types at once.
     * @param key Category Type
     * @param arr Array
     */
    private mergeArray(key: string, arr: any[]) {
        const strs: any = [];
        arr.forEach(alt => strs.push(`${key}=${alt}`));
        return strs.join('&');
    }

    /**
     * Convert an object into a browser-friendly query.
     * { one: 'two', three: 'four' } becomes ?one=two&three=four
     * @param obj Object
     */
    private querystring(obj: SearchOptions): string {
        return Object.keys(obj).map((key, index) => {
            const prefix = (index !== 0 ? '&' : '?');
            return prefix + (Array.isArray(obj[key]) ?
                this.mergeArray(key, obj[key]) :
                `${key}=${obj[key]}`
            );
        }).join('');
    }

    /**
     * Generate a querystring using defaults overwritten by search options
     * @param options SearchOptions
     */
    private getQuery(options: SearchOptions): string {
        // Replace spaces with +
        options.query = this.space(options.query);
        return this.querystring({
            start: 0,
            count: 50,
            search_descriptions: 0,
            sort_column: 'price',
            sort_dir: 'desc',
            game_appid: null,
            norender: 1,
            ...this.defaults,
            ...options
        });
    }

    /**
     * Handle the response received after call()ing the API
     * This checks for simple errors and/or a malformed response
     * @param res http response
     */
    private handle(res: IncomingMessage): Promise<Partial<SearchResult>[]> {
        return new Promise((resolve, reject) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);

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
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * Send a request to the target URL.
     * @param url Full API URL
     */
    private call(url: string): Promise<Partial<SearchResult>[]> {
        return new Promise((resolve, reject) => {
            if (this.debug) console.log(`call() ${url}`);
            get(url, this.reqOptions ?? {}, (res) => this.handle(res).then(resolve, reject));
        });
    }

    /**
     * Replace spaces with + to be used in URLs
     * @param str String
     */
    public space(str: string) {
        return str.split(' ').join('+');
    }

    /**
     * Set custom headers to be used in the request
     * See https://nodejs.org/api/http.html#http_http_request_url_options_callback
     * @param obj Any
     */
    public setHeaders(obj: any) {
        this.reqOptions.headers = obj;
    }

    /**
     * Set custom request options that will be used in each request
     * See https://nodejs.org/api/http.html#http_http_request_url_options_callback
     * @param obj RequestOptions
     */
    public setRequestOptions(obj: RequestOptions) {
        this.reqOptions = obj;
    }

    /**
     * Use with caution! This will set the default options for
     * each request.
     * To reset simply use useDefaults({});
     *
     * The options passed during a search will still overwrite these
     * defaults.
     * @param obj SearchOptions
     */
    public useDefaults(obj: Partial<SearchOptions>) {
        this.defaults = obj;
    }

    /**
     * Search the Steam Community Marketplace for items.
     * @param appid AppID of the game you want to search. Use 753 for Steam items like trading cards
     * @param options Search Options. Requires *at least* { query: 'Search Query' }
     */
    public search(
        appid: number, options: SearchOptions | string
    ): Promise<Partial<SearchResult>[]> {
        if (typeof options === 'string') options = { query: options };
        return new Promise((resolve, reject) => {
            const query = this.getQuery({ ...options as SearchOptions, appid });
            this.call(this.$market + query).then(resolve, reject);
        });
    }

    /**
     * Shortcut to search CSGO for items
     * @param options Search Options
     */
    public searchCSGO(options: SearchOptions | string): Promise<Partial<SearchResult>[]> {
        return new Promise((resolve, reject) => {
            if (typeof options === 'string') options = { query: options };
            return this.search(730, options).then(resolve, reject);
        });
    }

    /**
     * Shortcut to search TF2 for items
     * @param options Search Options
     */
    public searchTF2(options: SearchOptions | string): Promise<Partial<SearchResult>[]> {
        return new Promise((resolve, reject) => {
            if (typeof options === 'string') options = { query: options };
            return this.search(440, options).then(resolve, reject);
        });
    }

    /**
     * Search for items like trading cards, booster packs, emoticons or backgrounds.
     * @param options SearchOptions
     */
    public searchCommunity(options: SearchOptions) {
        return new Promise((resolve, reject) => {
            if (typeof options === 'string') options = { query: options };
            return this.search(753, options).then(resolve, reject);
        });
    }
}

/**
 * Precreated instance of the SteamMarket.
 */
export const market = new SteamMarket();
