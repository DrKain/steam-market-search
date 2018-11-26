var SteamMarketSearch = require('../index');

// 311210 = Call of Duty: Black Ops III

SteamMarketSearch.getMarketItems(311210).then(items => {
    console.log(items.count)
    // 37
    console.log(items.items)

}).catch(err => {
    console.log(`[ERR] ${err.name} -- ${err.message}`)
})
