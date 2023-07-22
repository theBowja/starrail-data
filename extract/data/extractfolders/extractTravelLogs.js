require('../global.js');

const xactivity = getExcel('ActivityPanel');


function collate(langCode) {
	const textmap = getLanguage(langCode);
	const mydata = Object.entries(xactivity).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = textmap[obj.TitleName.Hash];

		data.TabName = textmap[obj.TabName.Hash];

		data.Description = textmap[obj.PanelDesc.Hash]?.replaceAll('\\n', '\n');
		data.Tag = textmap[obj.TagDesc.Hash];
		data.Introduction = textmap[obj.IntroDesc.Hash]?.replaceAll('\\n', '\n');

		data.ImageIconTab = obj.TabIcon;

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;