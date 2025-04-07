require('../global.js');

const xloading = getExcel('LoadingDesc');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xloading).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.TitleTextmapID.Hash];

		if (language[obj.DescTextmapID.Hash] === undefined) {
			console.log(`No language mapping for LoadingDesc Id: ${id} DescTextmapID.Hash: ${obj.DescTextmapID.Hash}`);
			return accum;
		}
		data.Description = language[obj.DescTextmapID.Hash].replaceAll('\\n', '\n');

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;
