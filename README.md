# starrail-data
 Literally just a collection of JSONs. Data extracted directly from StarRailData repo.

 Requirements: Node 14+


# Web API

The web API is hosted by Vercel serverless functions. Base URL is: https://starrail-data.vercel.app

If you wish to create an API hosted somewhere else, it should be pretty easy to do it yourself since all the routes simply call a function in the `main.js` script.

## /api/config

TODO: Returns the list of available languages and folders. Proxy for `TODO`.

Example: https://starrail-data.vercel.app/api/config

## /api/[lang]/[folder]

Returns all data for a specific folder. Proxy for `getDataAll(lang, folder)`.

Example: https://starrail-data.vercel.app/api/EN/characters

## /api/[lang]/[folder]/[dataId]

Returns data for a specific data item. Proxy for `getDataItem(lang, folder, dataId)`.

Example: https://starrail-data.vercel.app/api/EN/characters/1001

## /api/[lang]/[folder]/search/[query]

Returns data for a specific data item. Proxy for `searchDataProps(lang, folder, query, properties)`.

Example: https://starrail-data.vercel.app/api/EN/characters/search/danheng