const fs = require('fs');
const Fuse = require('fuse.js');

function validLang(lang) {
	return true;
}

function validFolder(folder) {
	return true;
}

function getDataAll(lang, folder) {
	if (!validLang(lang) || !validFolder(folder)) return undefined;
	return require(`./data/${lang}/${folder}.json`);
}

function getDataItem(lang, folder, dataId) {
	if (!validLang(lang) || !validFolder(folder)) return undefined;
	return require(`./data/${lang}/${folder}.json`)[dataId];
}

function searchDataProps(lang, folder, query, properties=['Name']) {
	if (!validLang(lang) || !validFolder(folder)) return undefined;
	const data = require(`./data/${lang}/${folder}.json`);
	const fuse = new Fuse(Object.values(data), { minMatchCharLength: 2, keys: properties });
	return fuse.search(query).map(r => r.item);
}

module.exports = {
	getDataAll: getDataAll,
	getDataItem: getDataItem,
	searchDataProps: searchDataProps
}