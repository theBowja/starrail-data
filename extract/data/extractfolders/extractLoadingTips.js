require('../global.js');

const xloading = getExcel('LoadingDesc');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xloading).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.TitleTextmapID.Hash];

		data.Description = language[obj.DescTextmapID.Hash].replaceAll('\\n', '\n');

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;