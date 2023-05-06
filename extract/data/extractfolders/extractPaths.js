require('../global.js');

const xpath = getExcel('AvatarBaseType');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xpath).reduce((accum, [id, obj]) => {
		if (id === "Unknown") return accum;

		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.BaseTypeText.Hash];
		data.Description = language[obj.BaseTypeDesc.Hash]; // currently no one has this

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;