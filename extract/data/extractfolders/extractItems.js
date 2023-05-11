require('../global.js');

const xitem = getExcel('ItemConfig');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xitem).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.ItemName.Hash];


		data.ItemDesc = language[obj.ItemDesc.Hash];
		data.ItemBGDesc = language[obj.ItemBGDesc.Hash];
		


		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;