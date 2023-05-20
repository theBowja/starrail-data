require('../global.js');

const xgacha = getExcel('GachaBasicInfo');

function collate(langCode) {
	const textmap = getLanguage(langCode);
	const mydata = Object.entries(xgacha).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = textmap[obj.PoolName.Hash];
		data.Description = textmap[obj.PoolDesc.Hash];

		data.WarpType = obj.GachaType;
		data.WarpTypeText = textmap[obj.TypeTitle.Hash];

		data.ImageIconTab = obj.PoolLabelIcon;
		data.ImageIconTabSelected = obj.PoolLabelIconSelected;

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;