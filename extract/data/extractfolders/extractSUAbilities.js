require('../global.js');

const xrtalent = getExcel('RogueTalent');
const xitem = getExcel('ItemConfig');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xrtalent).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.EffectTitle.Hash];
		data.IsBigNode = !!obj.IsImportant;

		data.Effect = global.replaceParams(language[obj.EffectDesc.Hash], obj.EffectDescParamList);
		data.EffectTag = language[obj.EffectTag.Hash];

		data.Costs = obj.Cost.map(i => {
			return {
				Id: i.ItemID,
				Name: language[xitem[i.ItemID].ItemName.Hash],
				Count: i.ItemNum
			}
		});

		data.Unlocks = (obj.NextTalentIDList || []).map(e => e+'');

		data.Images = {
			Icon: obj.Icon
		}

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;