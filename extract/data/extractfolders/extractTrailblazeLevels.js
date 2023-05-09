require('../global.js');

const xplevel = getExcel('PlayerLevelConfig');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xplevel).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = obj.Level+'';
		data.Level = obj.Level;

		data.AccumulatedExpRequired = obj.PlayerExp || 0;

		if (xplevel[obj.Level+1])
			data.ExpToNextLevel = xplevel[obj.Level+1].PlayerExp - (xplevel[obj.Level].PlayerExp || 0);

		data.Rewards = global.GetRewardsData(language, obj.LevelRewardID) || [];


		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}


module.exports = collate;