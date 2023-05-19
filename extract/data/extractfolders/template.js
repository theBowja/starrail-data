require('../global.js');

const xchar = getExcel('AvatarConfig');


function collate(langCode) {
	const textmap = getLanguage(langCode);
	const mydata = Object.entries(xchar).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = textmap[obj.AvatarName.Hash];

		// data.Description = textmap[obj.AvatarDesc.Hash];

		data.DamageType = obj.DamageType;
		data.AvatarBaseType = obj.AvatarBaseType;
		data.Released = obj.Release;


		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;