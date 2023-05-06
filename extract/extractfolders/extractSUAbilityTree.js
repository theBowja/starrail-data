require('../global.js');

const xrtalent = getExcel('RogueTalent');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xrtalent).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.AvatarName.Hash];
		data.FullName = language[obj.AvatarFullName.Hash]; // currently no one has this
		if (data.FullName) console.log(`Character full name: ${data.FullName}`);

		// data.Description = language[obj.AvatarDesc.Hash];

		data.DamageType = obj.DamageType;
		data.AvatarBaseType = obj.AvatarBaseType;
		data.Released = obj.Release;


		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;