const fs = require('fs');

function validLang(lang) {
	return true;
}

function validFolder(folder) {
	return true;
}

function getDataSync(lang, folder, dataId) {
	if (!validLang(lang) || !validFolder(folder)) return undefined;

	const data = fs.readFileSync(`data/${lang}/${folder}.json`, 'utf8');
	return JSON.parse(data)[dataId];
}

function getDataAll(lang, folder) {
	if (!validLang(lang) || !validFolder(folder)) return undefined;
	return require(`./data/${lang}/${folder}.json`);
}

function getDataItem(lang, folder, dataId) {
	if (!validLang(lang) || !validFolder(folder)) return undefined;

	return require(`./data/${lang}/${folder}.json`)[dataId];
	// fs.readFile(`data/${lang}/${folder}.json`, 'utf8', (err, data) => {
		// return JSON.parse(data)[dataId];
	// });
}

module.exports = {
	getDataAll: getDataAll,
	getDataItem: getDataItem
}