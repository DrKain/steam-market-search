/**
 * The search options required to search the Steam Community Marketplace.
 * The only required option is `query`, Everything else is entirely optional.
 */
export interface SearchOptions {
    query: string;
    /**
     * AppID of the game you want to search.
     * To get trading cards set appid to 753 and game_appid
     * to the game you want the cards from.
     */
    appid?: number;
    start?: number;
    /** Number of results to be returned in the search. Defaults to 50 */
    count?: number;
    /** Sort the results by price or quantity available */
    sort_column?: 'price' | 'quantity';
    /** Sort the results ascending or descending */
    sort_dir?: 'asc' | 'desc';
    /** Allows your search query to match descriptions too. 1 = true, 0 = false */
    search_descriptions?: 1 | 0;
    /** Enables or disables HTML response. Changing this is not recommended */
    norender?: 1 | 0;
    /** A custom search parameter */
    [key: string]: any;
}
/**
 * Asset Descriptions used in SearchResult
 */
export interface AssetDescription {
    /** AppID of the game this item is from */
    appid: number;
    classid: string;
    instanceid: string;
    /** Background color of the item */
    background_color: string;
    /**
     * The image hash.
     * Preceed with `https://steamcommunity-a.akamaihd.net/economy/image/` to receive
     * a working image URL
     */
    icon_url: string;
    /** If the item can be traded or not */
    tradable: number;
    /** Name of the item */
    name: string;
    /** HEX color code of the items name */
    name_color: string;
    /** Item type. Value varies with each game and item */
    type: string;
    /** Name displayed in the market */
    market_name: string;
    /**
     * Market name used in the URL to link to the item.
     * Use like so: `https://steamcommunity.com/market/listings/GAMEAPPID/MARKET_HASH`
     */
    market_hash_name: string;
    commodity: number;
}
/**
 * The expected result returned from a search.
 */
export interface SearchResult {
    /** Name of the item */
    name: string;
    /** Hash name of the item */
    hash_name: string;
    /** Quantity of the item for sale on the marketplace */
    sell_listings: number;
    /** Price of the item in USD */
    sell_price: number;
    /** Price of the item in USD */
    sell_price_text: string;
    /** Icon hash for the game the item is from */
    app_icon: string;
    /** Name of the game the item is in */
    app_name: string;
    /**
     * A collection of additional information about the item.
     * May be undefined depending on the game
     */
    asset_description: AssetDescription;
    /** Sale price of the item in USD */
    sale_price_text: string;
}
