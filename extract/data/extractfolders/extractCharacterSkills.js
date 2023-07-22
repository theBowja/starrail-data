require('../global.js');

const xchar = getExcel('AvatarConfig');
const xskill = getExcel('AvatarSkillConfig');

function collate(langCode) {
	const textmap = getLanguage(langCode);
	const mydata = Object.entries(xchar).reduce((accum, [id, obj]) => {
		if (!obj.Release) return accum;
		if (obj.AvatarVOTag === 'test') return accum;

		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = textmap[obj.AvatarName.Hash];

		data.BasicATK = collateSkills(textmap, obj.SkillList[0]);
		if (obj.SkillList.filter(e => (e+'').endsWith('8')).length > 0)
			data.EnhancedBasicATK = collateSkills(textmap, obj.SkillList.filter(e => (e+'').endsWith('8'))[0]);
		data.Skill = collateSkills(textmap, obj.SkillList[1]);
		if (obj.SkillList.filter(e => (e+'').endsWith('9')).length > 0)
			data.EnhancedSkill = collateSkills(textmap, obj.SkillList.filter(e => (e+'').endsWith('9'))[0]);
		data.Ultimate = collateSkills(textmap, obj.SkillList[2]);
		if (obj.SkillList.filter(e => (e+'').endsWith('10')).length > 0)
			console.log(`Error: char ${id} skill has enhanced ultimate or something`);
		data.Talent = collateSkills(textmap, obj.SkillList[3]);
		data.Technique = collateSkills(textmap, obj.SkillList[5]);

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

function collateSkills(textmap, skillId) {
	const obj = xskill[skillId];
	if (!obj) {
		console.log(`missing skillid: ${skillId}`);
		return {};
	}

	const data = {};

	data.Id = skillId+'';
	data.Name = textmap[obj['1'].SkillName.Hash];
	data.TriggerKey = obj['1'].SkillTriggerKey;

	data.TagType = obj['1'].SkillEffect;
	data.TagTypeText = textmap[obj['1'].SkillTag.Hash];

	data.SkillTypeText = textmap[obj['1'].SkillTypeDesc.Hash];
	data.MaxLevel = obj['1'].MaxLevel;

	data.EffectRaw = textmap[obj['1'].SkillDesc.Hash].replaceAll('\\n', '\n');
	if (textmap[obj['1'].SimpleSkillDesc.Hash]) {
		data.AbridgedEffect = textmap[obj['1'].SimpleSkillDesc.Hash].replaceAll('\\n', '\n');
		// if (data.AbridgedEffect.includes('[i') || data.AbridgedEffect.includes['[f'])
		// 	console.log(`Error: skill ${skillId} AbridgedEffect includes a replaceable parameter`);
	}

	data.ElementType = obj['1'].StanceDamageType;

	data.Levels = {};
	for (let level = 1; level <= obj['1'].MaxLevel; level++) {
		data.Levels[level] = {};
		data.Levels[level].EffectValues = global.roundParams(obj[level].ParamList.map(e => e.Value));
		// if (textmap[obj['1'].SimpleSkillDesc.Hash])
		// 	data.AbridgedEffectValues =  global.roundParams(obj[level].SimpleParamList.map(e => e.Value));
	}

	data.ImageIcon = obj['1'].SkillIcon;

	return data;
}

module.exports = collate;