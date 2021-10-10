# Steam Market Search  

[![NPM](https://img.shields.io/npm/v/steam-market-search)](https://www.npmjs.com/package/steam-market-search) [![NPM](https://img.shields.io/npm/dt/steam-market-search)](https://www.npmjs.com/package/steam-market-search) [![NPM](https://img.shields.io/npm/types/steam-market-search)](https://www.npmjs.com/package/steam-market-search)


Steam Market Search is a NodeJS package to search the Steam Community Market. 
Using this package you will be able to search and retrieve images, prices, descriptions, listing counts and other various information made available by each app.  
  
| Contents     | Type |  
| :------------ | :- | 
| [Getting Started](#getting-started) | Setup |   
| [search(appid, options)](#searchappid-options) | Method |    
| [Basic Search](#basic-search) | Code Example |   
| [Advanced Search](#advanced-search) | Code Example |   
| [setRequestOptions(options)](#setrequestoptionsrequestoptions) | Method |  
| [Custom Headers](#custom-headers) | Code Example |   
| [Shortcuts](#shortcuts) | Code Example |    
| [Steam Item Types](#steam-item-types) | Table Data |   
| [Multiple Filters](#multiple-filters) | Code Example |   
| [SearchOptions](#type-searchoptions) | Type |   

# Getting Started 

Install via NPM   
> npm install steam-market-search  

Then you can require the package in your project using TypeScript  
```typescript
import { market } from 'steam-market-search';
```
or JavaScript  
```javascript
const market = require('steam-market-search').market;  
```  

# Usage  
*Below is my attempt at documenting how to use this package. If you feel like you can do better please feel free to make a pull request.*  
  
### search(appid, options);  
*Searches the marketplace for items.*  

| Property | Description | Type | Default |
| :- | :- | :- | :- |  
| appid | The AppID of the game you want to fetch items for. Use 753 (steam) for items like trading cards. | number | none |  
| options | Either a [SearchOptions](#type-searchoptions) object or a string to be used as the search query. | [SearchOptions](#type-searchoptions) or string | none |

#### Basic Search
*Search `730` (CSGO) for a gun skin called `Death by Kitty`.*  
```typescript
market.search(730, 'Death By Kitty').then(results => {
    console.log(results);
});
```

#### Advanced Search
*Search `290340` (Armello) for a `Dire Key` item using a custom item type*  
```typescript
market.search(290340, { query: 'Dire', 'category_290340_type[]': 'tag_key' }).then(results => {
    console.log(results);
});

```  

### setRequestOptions(RequestOptions)  
*Allows you to define custom [RequestOptions](https://nodejs.org/api/http.html#http_http_request_url_options_callback) like headers to be passed when making API Calls.*  

| Property | Description | Type | Default |
| :- | :- | :- | :- |  
| RequestOptions | An object of custom request options to be passed during the API Call. | [RequestOptions](https://nodejs.org/api/http.html#http_http_request_url_options_callback) | `{ }` | 
  
#### Custom Headers   
*This is an example that uses setRequestOptions() to change the language of the search results*  
  
```typescript  
market.setRequestOptions({
    headers: {
        'Accept-Language': 'de'
    }
});
```   
*Now all requests made on `market` will be in German.*  
```typescript   
market.search(730, 'Death by Kitty').then(results => console.log(results));  
```  
  
# Shortcuts  
*As a lot of people use this for apps like CS:GO, TF2 or Dota there are several shortcuts to quickly search that specific app.*  
  
```typescript
market.searchCSGO('Death by Kitty');
market.searchTF2('Crate Key');  

// tag_item_class_4 = Emoticons
market.searchCommunity({ query: 'Heart', 'category_753_item_class[]': 'tag_item_class_4' });
```  
  
# Additional Examples  
*Below are some more examples or explanations that may be helpful*  
  
### Steam Item Types  
*When using `searchCommunity()` you may want to only fetch certain types of items. Below is a table listing each type and the value required to filter*  

| Type | Option | Value |  
| :- | :- | :- |  
| Trading Card | `category_753_item_class[]` | `tag_item_class_2` |
| Emotion | `category_753_item_class[]` | `tag_item_class_4` |
| Profile Background | `category_753_item_class[]` | `tag_item_class_3` |
| Booster Pack | `category_753_item_class[]` | `tag_item_class_5` |
| Sale Items (saliens) | `category_753_item_class[]` | `tag_item_class_10` |
| Consumable | `category_753_item_class[]` | `tag_item_class_6` |  
| Normal Cards | `category_753_cardborder[]` | `tag_cardborder_0` |  
| Foil Cards | `category_753_cardborder[]` | `tag_cardborder_1` |  
| Rarity (Common) | `category_753_droprate[]` | `tag_droprate_0` |    
| Rarity (Uncommon) | `category_753_droprate[]` | `tag_droprate_1` |      
| Rarity (Rare) | `category_753_droprate[]` | `tag_droprate_2` |        
| Rarity (Extraordinary) | `category_753_droprate[]` | `tag_droprate_3` |  
| Game | `category_753_Game[]` | `tag_app_APPID` |  


#### Multiple Filters    
*The following example will search for any `Normal` or `Foil` `Trading Cards` that contain the word `Heart`*  

```typescript  
market.searchCommunity({
    query: 'Heart',
    'category_753_cardborder[]': [
        'tag_cardborder_0', // Normal Border
        'tag_cardborder_1'  // Foil Border
    ],
    'category_753_item_class[]': 'tag_item_class_2' // Trading Cards
}).then(results => console.log(results));
```  
  
#### Filter by game
If you only want community items from a specific game you can filter them using the `category_753_Game[]` option.
Like all options ending with square brackets you can pass multiple game appids at once.

```js
// Search for steam community items from the game "100% Orange Juice" 
market.search(753, { 'category_753_Game[]': 'tag_app_282800', query: 'stars' });
```
  
#### Type: SearchOptions  
*This is the options object you would pass instead of a string when searching*  

| Property | Description | Type | Default |    
| :- | :- | :- | :- |  
| query | The search query | string | None |  
| appid | The game AppID you want to find items for. | number | None |  
| start | Start at | number | None |  
| count | Number of results to be returned in the search. | number | `50` |  
| sort_column | Sort the results by price or quantity available | string | None |  
| sort_dir | Sort the results ascending or descending | string | `asc` | 
| search_descriptions | Allows your search query to match descriptions too | number | 0 | 
| norender | Enables or disables HTML response. Changing this will likely prevent the search results from returning. | number | 1 | 
| *custom* | Allows custom parameters like category filters | string or array | None | 
