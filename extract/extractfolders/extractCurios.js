require('../global.js');

const xrogue = getExcel('RogueMiracle');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xrogue).reduce((accum, [id, obj]) => {
		if (!obj.IsShow) return accum;

		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.MiracleName.Hash];

		// if (!language[obj.MiracleDesc.Hash]) return accum; // for !IsShow
		data.Effect = global.replaceParams(language[obj.MiracleDesc.Hash], obj.DescParamList);
		data.Story = language[obj.MiracleBGDesc.Hash].replace('\\n', '\n');

		// data.IsShow = obj.IsShow;

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;