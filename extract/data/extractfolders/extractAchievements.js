require('../global.js');

const xachieve = getExcel('AchievementData');
const xseries = getExcel('AchievementSeries');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xachieve).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.AchievementTitle.Hash];
		data.SortOrder = obj.Priority;

		data.Rarity = obj.Rarity;
		data.SeriesId = obj.SeriesID;
		data.SeriesText = language[xseries[obj.SeriesID].SeriesTitle.Hash];
		data.Description = global.replaceParams(language[obj.AchievementDesc.Hash], obj.ParamList);
		if (obj.HideAchievementDesc) {
			data.HiddenDescription = language[obj.HideAchievementDesc.Hash];
		}

		if (obj.RecordText) {
			data.RecordText = language[obj.RecordText.Hash];
		}

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;