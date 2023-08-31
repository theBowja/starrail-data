require('../global.js');

const xrogue = getExcel('RogueMiracle');
const xrdisp = getExcel('RogueMiracleDisplay');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xrogue).reduce((accum, [id, obj]) => {
		if (!obj.IsShow) return accum;

		const data = {};
		data.Id = id;
		let filename = id;

		let disp = xrdisp[obj.MiracleDisplayID];

		data.Name = language[disp.MiracleName.Hash];

		// if (!language[disp.MiracleDesc.Hash]) return accum; // for !IsShow
		data.Effect = global.replaceParams(language[disp.MiracleDesc.Hash], disp.DescParamList);
		data.Story = language[disp.MiracleBGDesc.Hash].replace('\\n', '\n');

		// data.IsShow = obj.IsShow;

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;