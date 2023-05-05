require('../global.js');

const xcone = getExcel('EquipmentConfig');
const xsuper = getExcel('EquipmentSkillConfig');
const xpath = getExcel('AvatarBaseType');


function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xcone).reduce((accum, [id, obj]) => {
		if (!obj.Release) return accum;

		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.EquipmentName.Hash];

		data.PathType = obj.AvatarBaseType;
		data.PathTypeText = language[xpath[obj.AvatarBaseType].BaseTypeText.Hash];

		// data.Description = language[obj.EquipmentDesc.Hash];
		data.EffectName = language[xsuper[obj.SkillID]['1'].SkillName.Hash];
		data.EffectTemplate = language[xsuper[obj.SkillID]['1'].SkillDesc.Hash].replaceAll('<unbreak>', '').replaceAll('</unbreak>', '')

		data.Superimpositions = [1, 2, 3, 4, 5].map(rank => {
			const rankObj = xsuper[obj.SkillID][rank];
			const rankData = {};
			rankData.Effect = replaceParams(language[xsuper[obj.SkillID]['1'].SkillDesc.Hash], rankObj.ParamList)
			rankData.Params = rankObj.ParamList.map((param, index) => {
				let value = global.roundTwoDecimals(param.Value);
				if (data.EffectTemplate.includes(`#${index+1}[i]%`))
					value = roundTwoDecimals(value * 100) + '%';
				else
					value += '';
				return value;
			});
			return rankData;
		});


		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;