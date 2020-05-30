/// <reference types="node" />
import { RequestOptions } from 'https';
import { SearchOptions, SearchResult } from './interface';
export declare class SteamMarket {
    debug: boolean;
    private $market;
    $image: string;
    private reqOptions;
    private defaults;
    constructor();
    /**
     * Merges category filters into a single value to allow filtering
     * of multiple category types at once.
     * @param key Category Type
     * @param arr Array
     */
    private mergeArray;
    /**
     * Convert an object into a browser-friendly query.
     * { one: 'two', three: 'four' } becomes ?one=two&three=four
     * @param obj Object
     */
    private querystring;
    /**
     * Generate a querystring using defaults overwritten by search options
     * @param options SearchOptions
     */
    private getQuery;
    /**
     * Handle the response received after call()ing the API
     * This checks for simple errors and/or a malformed response
     * @param res http response
     */
    private handle;
    /**
     * Send a request to the target URL.
     * @param url Full API URL
     */
    private call;
    /**
     * Replace spaces with + to be used in URLs
     * @param str String
     */
    space(str: string): string;
    /**
     * Set custom headers to be used in the request
     * See https://nodejs.org/api/http.html#http_http_request_url_options_callback
     * @param obj Any
     */
    setHeaders(obj: any): void;
    /**
     * Set custom request options that will be used in each request
     * See https://nodejs.org/api/http.html#http_http_request_url_options_callback
     * @param obj RequestOptions
     */
    setRequestOptions(obj: RequestOptions): void;
    /**
     * Use with caution! This will set the default options for
     * each request.
     * To reset simply use useDefaults({});
     *
     * The options passed during a search will still overwrite these
     * defaults.
     * @param obj SearchOptions
     */
    useDefaults(obj: Partial<SearchOptions>): void;
    /**
     * Search the Steam Community Marketplace for items.
     * @param appid AppID of the game you want to search. Use 753 for Steam items like trading cards
     * @param options Search Options. Requires *at least* { query: 'Search Query' }
     */
    search(appid: number, options: SearchOptions | string): Promise<Partial<SearchResult>[]>;
    /**
     * Shortcut to search CSGO for items
     * @param options Search Options
     */
    searchCSGO(options: SearchOptions | string): Promise<Partial<SearchResult>[]>;
    /**
     * Shortcut to search TF2 for items
     * @param options Search Options
     */
    searchTF2(options: SearchOptions | string): Promise<Partial<SearchResult>[]>;
    /**
     * Search for items like trading cards, booster packs, emoticons or backgrounds.
     * @param options SearchOptions
     */
    searchCommunity(options: SearchOptions): Promise<unknown>;
}
/**
 * Precreated instance of the SteamMarket.
 */
export declare const market: SteamMarket;
