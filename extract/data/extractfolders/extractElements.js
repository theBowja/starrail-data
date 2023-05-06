require('../global.js');

const xelement = getExcel('DamageType');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xelement).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.DamageTypeName.Hash];
		data.Description = language[obj.DamageTypeIntro.Hash]; // currently no one has this

		data.Color = obj.Color;

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;