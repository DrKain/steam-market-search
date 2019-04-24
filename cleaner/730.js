var util = require("../util");

function item_color(color){
    switch(color){
        case "CF6A32":
            return { hex : color, identity : "StatTrak" };
        case "FFD700":
            return { hex : color, identity : "Souvenir" };
        case "8650AC":
            return { hex : color, identity : "Knife" };
        default:
            return { hex : color };
    }
}

module.exports = function(items){

    items.map(function(item){
        item['sell_price']  = (item['sell_price'] / 100).toFixed(2);
        item['sale_price']  = util.priceToNum( item['sale_price_text'] );
        item['image']       = util.toimageURL(item['asset_description']['icon_url']);
        item['appid']       = item['asset_description']['appid'];
        item['color']       = item_color(item['asset_description']['name_color']);

        // Not important or already used
        delete item['asset_description']['market_name'];
        delete item['asset_description']['market_hash_name'];
        delete item['asset_description']['tradable'];
        delete item['asset_description']['icon_url'];
        delete item['asset_description']['name'];
        delete item['asset_description']['appid'];
        // Backgound is always the same
        delete item['asset_description']['background_color'];
        // moved to item.color
        delete item['asset_description']['name_color'];
        // These are subject to change and should not be used
        delete item['asset_description']['instanceid'];
        delete item['asset_description']['classid'];
        // Delete text variants of prices
        delete item['sell_price_text'];
        delete item['sale_price_text'];
        // The app icon doesn't change.
        delete item['app_icon'];
    });

    return items;
};