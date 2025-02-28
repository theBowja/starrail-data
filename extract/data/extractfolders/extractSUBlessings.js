require('../global.js');

const xblessing = getExcel('RogueMazeBuff');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xblessing).reduce((accum, [id, obj]) => {
		enhancedObj = obj['2'];
		obj = obj['1'];

		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.BuffName.Hash];
		if (data.Name === undefined) return accum;
		data.Rarity = obj.BuffRarity;

		data.Effect = global.replaceParams(language[obj.BuffDesc.Hash], obj.ParamList);
		data.AbridgedEffect = language[obj.BuffSimpleDesc.Hash] && global.replaceParams(language[obj.BuffSimpleDesc.Hash], obj.ParamList).replaceAll('\\n', '\n');

		if (enhancedObj) {
			data.EnhancedEffect = global.replaceParams(language[enhancedObj.BuffDesc.Hash], enhancedObj.ParamList);
			data.EnhancedAbridgedEffect = global.replaceParams(language[enhancedObj.BuffSimpleDesc.Hash], enhancedObj.ParamList).replaceAll('\\n', '\n');
		}

		// data.BuffDescBattle = language[obj.BuffDescBattle.Hash];
		if (obj.BuffDescBattle && language[obj.BuffDescBattle.Hash] && language[obj.BuffDesc.Hash] !== language[obj.BuffDescBattle.Hash]) {
			console.log(`${id} has BuffDescBattle`);
		}

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;