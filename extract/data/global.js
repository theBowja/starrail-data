const fs = require('fs');
const path = require('path');
var JSONbig = require('json-bigint');

const config = require('../config.json');

function readJson(path) {
	const jsonfile = fs.readFileSync(path)
	return JSONbig.parse(jsonfile);
}

global.getExcel = function(file, id) {
	const data = readJson(`${config.StarRailData_folder}/ExcelOutput/${file}.json`);
	const mapId = id ? id : Object.keys(data[0])[0];

	let subLevel;
	if (Object.keys(data[0]).includes('Level')) subLevel = 'Level';
	else if (Object.keys(data[0]).includes('RequireNum')) subLevel = 'RequireNum';
	else if (Object.keys(data[0]).includes('Lv')) subLevel = 'Lv';
	return data.reduce((accum, curr) => {
		if (subLevel) {
			if (accum[curr[mapId]] === undefined) accum[curr[mapId]] = {};
			accum[curr[mapId]][curr[subLevel]] = curr;
		} else {
			accum[curr[mapId]] = curr;
		}
		return accum;
	}, {});
}
global.getTextMap = function(langcode) { return require(`${config.StarRailData_folder}/TextMap/TextMap${langcode}.json`); }

const langcodes = ['CHT', 'CHS', 'DE', 'EN', 'ES', 'FR', 'ID', 'JP', 'KR', 'PT', 'RU', 'TH', 'VI'];
// const langcodes = ['EN']; // for debug purposes

global.getLanguage = function(abbriev) { return getTextMap(abbriev.toUpperCase()); }


global.GetStableHash = require('./GetStableHash.js');

global.TrailblazerHash = "6354779731002018877";
global.getTrailblazerCanonName = function(textmap, isMale=true) {
	const str = isMale ? textmap["1326924780841415949"] : textmap["15712915167873200526"];
	if (str.includes('「'))
		return str.substring(str.indexOf('「')+1, str.indexOf('」'));
	else if (str.includes('„'))
		return str.substring(str.indexOf('„')+1, str.indexOf('“'));
	else if (str.includes('\"'))
		return str.substring(str.indexOf('\"')+1, str.lastIndexOf('\"'));
	else
		return str.substring(str.lastIndexOf(' ')+1);
};

global.replaceGender = function(str, isMale=true) { return isMale ? replaceGenderM(str) : replaceGenderF(str); };
global.replaceGenderM = function(str) { return str.replace(/{F#.*?}/gi, '').replace(/{M#(.*?)}/gi, '$1'); };
global.replaceGenderF = function(str) { return str.replace(/{M#.*?}/gi, '').replace(/{F#(.*?)}/gi, '$1'); };
global.sanitizeText = function(str) { return str.replaceAll('<unbreak>', '').replaceAll('</unbreak>', '').replaceAll('\\n', '\n'); };

// params: array of numbers that have the property Value with the value of the parameter
global.replaceParams = function(str, params, applyFormat=true) {
	if (params[0] !== undefined && params[0].Value !== undefined) params = params.map(e => e.Value);

	const regex = /#(\d*?)\[(.*?)\](%?)/g;
	let match = regex.exec(str);

	while (match !== null) {
		const toreplace = match[0];
		const index = parseInt(match[1])-1;
		const format = match[2];
		const isPercent = match[3] === '%';

		let value = isPercent ? params[index]*100 : params[index];
		value = Math.round(value * 10000) / 10000; // round to 4 decimal places

		if (!applyFormat) {
			value = value;
		} else if (format === 'i') { // integer
			value = Math.floor(value);
		} else if (format.startsWith('f')) { // float
			const digits = parseInt(format.substring(1));
			value = value.toFixed(digits);
		} else {
			console.log(`Error: unknown format in replaceParams ${toreplace} for ${str}`);
		}

		str = str.replaceAll(toreplace, value+match[3]);

		match = regex.exec(str);
	}

	str = str.replaceAll('<unbreak>', '').replaceAll('</unbreak>', '');
	return str.replaceAll('\\n', '\n');
}
global.roundParams = function(params) {
	return params.map(n => Math.round(n * 10000) / 10000); // round to 4 decimal places
}
global.roundTwoDecimals = function(value) {
	return Math.round(value * 10000) / 10000;
}
global.roundFloat = function(value) {
	return Math.round(value * 10000) / 10000;
}

global.GetRewardsData = function(textmap, rewardId) {
	if (rewardId === undefined) return undefined;

	const xreward = getExcel('RewardData');
	const xitem = getExcel('ItemConfig');
	const xeidolon = getExcel('ItemConfigAvatarRank');
	const xrelic = getExcel('RelicConfig');
	const xrelicdata = getExcel('RelicDataInfo');
	const xweapon = getExcel('EquipmentConfig');

	const rewardObj = xreward[rewardId];

	const rewards = [];
	if (rewardObj.Hcoin) {
		rewards.push({
			Id: 1,
			Name: textmap[xitem['1'].ItemName.Hash],
			RewardType: 'ITEM',
			Count: rewardObj.Hcoin
		});
	}

	let i = 1;
	while(rewardObj[`ItemID_${i}`]) {
		const itemId = rewardObj[`ItemID_${i}`];

		if (xitem[itemId]) {
			rewards.push({
				Id: itemId,
				Name: textmap[xitem[itemId].ItemName.Hash],
				RewardType: 'ITEM',
				Count: rewardObj[`Count_${i}`]
			});
		} else if (xrelic[itemId]) {
			const relicSetId = xrelic[itemId].SetID;
			rewards.push({
				Id: itemId,
				Name: textmap[GetStableHash(xrelicdata[relicSetId][xrelic[itemId].Type].RelicName)],
				RewardType: 'RELIC',
				RelicSetId: relicSetId,
				RelicType: xrelic[itemId].Type,
				RelicRarity: xrelic[itemId].Rarity,
				Count: rewardObj[`Count_${i}`]
			});
		} else if (xweapon[itemId]) {
			rewards.push({
				Id: itemId,
				Name: textmap[xweapon[itemId].EquipmentName.Hash],
				RewardType: 'LIGHTCONE',
				Count: rewardObj[`Count_${i}`]
			});
		} else if (xeidolon[itemId]) {
			rewards.push({
				Id: itemId,
				Name: textmap[xeidolon[itemId].ItemName.Hash],
				RewardType: 'EIDOLON',
				Count: rewardObj[`Count_${i}`]
			});
		} else {
			console.log(`Unknown reward type for item id ${itemId}`);
		}

		i++;
	}

	return rewards;
}

/* =========================================================================================== */

let version = '';
function setVersion(v) {
	version = v;
}
function getVersion() {
	return version;
}

// if (!fs.existsSync('./versioncache.json')) fs.writeFileSync('./versioncache.json', '{}');
const versioncache = require('./versioncache.json');
function updateDataVersionAdded(folder, data) {
	for (let [id, obj] of Object.entries(data)) {
		if (!versioncache[folder]) versioncache[folder] = {}; // initialize if not exist

		// check if id doesn't exist in version cache
		if (!versioncache[folder][id] && version !== '') {
			versioncache[folder][id] = version;
		}

		if (versioncache[folder][id]) {
			obj.VersionAdded = versioncache[folder][id];
		}
	}

	// save version cache
	fs.writeFileSync(path.resolve(__dirname,`./versioncache.json`), JSON.stringify(versioncache, null, '\t'));
}

// function exportCurve(folder, file) {
// 	const xcurve = getExcel(file);
// 	let output = {};
// 	xcurve.forEach(ele => {
// 		let curveinfo = {};
// 		ele.curveInfos.forEach(ele => {
// 			curveinfo[ele.type] = ele.value;
// 		});
// 		output[ele.level] = curveinfo;
// 	});
// 	fs.mkdirSync(`${config.starrail_export_folder}/curve`, { recursive: true });
// 	fs.writeFileSync(`${config.starrail_export_folder}/curve/${folder}.json`, JSON.stringify(output, null, '\t'));
// }

function exportData(folder, collateFunc, englishonly, skipwrite) {
	langcodes.forEach(lang => {
		if(englishonly && lang !== 'EN') return;
		let data = collateFunc(lang);
		updateDataVersionAdded(folder, data);

		fs.mkdirSync(`${config.starrail_export_folder}/${lang}`, { recursive: true });
		if(!skipwrite) {
			fs.writeFileSync(`${config.starrail_export_folder}/${lang}/${folder}.json`, JSON.stringify(data, null, '\t'));
			if(JSON.stringify(data).search('undefined') !== -1) console.log('undefined found in '+folder);
			if(data[""]) console.log('empty key found in '+folder);
		}
	});
	console.log("done "+folder);
}

module.exports = {
	setVersion: setVersion,
	getVersion: getVersion,
	// exportCurve: exportCurve,
	exportData: exportData
}
