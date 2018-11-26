const fetch = require('node-fetch')

const steam_icon_url_route = 'https://steamcommunity-a.akamaihd.net/economy/image/'
const steam_item_url_route = 'https://steamcommunity.com/market/listings/753/'

// map -- async f(getMarketItems) > async f(call) > f(pattern_finder)

module.exports = {
    async getMarketItems(appid) {
        const url = `https://steamcommunity.com/market/search/render/?search_descriptions=0&sort_column=default&sort_dir=desc&appid=${Number(appid)}&norender=1&count=500`
        
        const market_items = await this.call(url)

        return {
            count: market_items.length,
            items: market_items
        }
    },

    async call(url) {
        const url_call = await fetch(url)
        const res = await url_call.json()

        let items = res.results.map(item => {
            return {
                name: item.name,
                hash_name: item.hash_name,
                sell_price: item.sell_price / 100,
                sell_price_text: item.sell_price_text,
                sell_listings: item.sell_listings,
                appid: item.asset_description.appid,
                item_type: this.pattern_finder(item.asset_description.type),
                icon_url: `${steam_icon_url_route}${item.asset_description.icon_url}`,
                link: `${steam_item_url_route}${encodeURIComponent(item.asset_description.market_hash_name)}`
            }
        }, [])

        return items
    },

    pattern_finder(pattern) {
        const reg = /(Booster Pack|Trading Card|Emoticon|Profile Background)/g
        return pattern.match(reg)[0]
    },
}
