require('../global.js');

const xmonster = getExcel('MonsterConfig');
const xmtemplate = getExcel('MonsterTemplateConfig');
const xmskill = getExcel('MonsterSkillConfig');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xmonster).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.MonsterName.Hash];
		if (data.Name === undefined || data.Name === '') return accum;

		data.Introduction = language[obj.MonsterIntroduction.Hash]?.replaceAll('\\n', '\n');
		if (data.Introduction === undefined || data.Introduction === '') return accum;

		data.ElementalWeaknesses = obj.StanceWeakList;

		data.ElementalResistance = {
			Physical: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Physical')?.Value?.Value ?? 0),
			Fire: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Fire')?.Value?.Value ?? 0),
			Ice: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Ice')?.Value?.Value ?? 0),
			Wind: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Wind')?.Value?.Value ?? 0),
			Thunder: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Thunder')?.Value?.Value ?? 0),
			Quantum: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Quantum')?.Value?.Value ?? 0),
			Imaginary: roundTwoDecimals(obj.DamageTypeResistance.find(e => e.DamageType === 'Imaginary')?.Value?.Value ?? 0),
		};

		data.SkillList = obj.SkillList.map(skillId => {
			const skillObj = xmskill[skillId];
			const skillData = {};
			skillData.Id = skillId;
			skillData.Name = language[skillObj.SkillName.Hash];
			skillData.SkillDesc = language[skillObj.SkillDesc.Hash];
			skillData.SkillTypeDesc = language[skillObj.SkillTypeDesc.Hash];
			skillData.ElementType = skillObj.DamageType;
			return skillData;
		}).filter(s => s.Name && s.SkillDesc); // filter removes normal attacks and some special follow-up skills

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;