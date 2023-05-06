require('../global.js');

const xchar = getExcel('AvatarConfig');
const xeidolon = getExcel('AvatarRankConfig')
const xelement = getExcel('DamageType');
const xpath = getExcel('AvatarBaseType');
const xskill = getExcel('AvatarSkillConfig');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xchar).reduce((accum, [id, obj]) => {
		if (!obj.Release) return accum;
		if (obj.AvatarVOTag === 'test') return accum;

		const isPlayerCharacter = obj.AvatarVOTag.includes("player");
		const isPlayerMale = obj.AvatarVOTag.includes("boy");

		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.AvatarName.Hash];
		data.FullName = language[obj.AvatarFullName.Hash]; // currently no one has this
		if (data.FullName) console.log(`Character full name: ${data.FullName}`);

		if (isPlayerCharacter) {
			data.TrailblazerCanonName = global.getTrailblazerCanonName(language, isPlayerMale);
			data.TrailblazerGender = isPlayerMale ? "M" : "F";
		}

		data.ElementType = obj.DamageType;
		data.ElementTypeText = language[xelement[obj.DamageType].DamageTypeName.Hash];
		data.PathType = obj.AvatarBaseType;
		data.PathTypeText = language[xpath[obj.AvatarBaseType].BaseTypeText.Hash];

		// If player character, then change their name to: Trailblazer (Fire)
		if (isPlayerCharacter) {
			data.Name = `${global.replaceGender(language[TrailblazerHash], isPlayerMale)} (${data.ElementTypeText})`;
		}

		data.Eidolons = obj.RankIDList.map(rankId => {
			const rankObj = xeidolon[rankId];
			const rankData = {
				Id: rankId+'',
				Name: language[GetStableHash(rankObj.Name)],
				Effect: global.replaceGender(global.replaceParams(language[GetStableHash(rankObj.Desc)], rankObj.Param), isPlayerMale),
			};
			return rankData;
		});

		data.Skills = {
			BasicATK: collateSkills(language, obj.SkillList[0]),
			Skill: collateSkills(language, obj.SkillList[1]),
			Ultimate: collateSkills(language, obj.SkillList[2]),
			Talent: collateSkills(language, obj.SkillList[3]),
			Technique: collateSkills(language, obj.SkillList[5]),
		};
		// TODO: add enhanced basic atk (traveler fire, qingque) and enhanced skills (hook)



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

	data.Id = skillId;
	data.Name = textmap[obj['1'].SkillName.Hash];
	data.TriggerKey = obj['1'].SkillTriggerKey;

	data.TagType = obj['1'].SkillEffect;
	data.TagTypeText = textmap[obj['1'].SkillTag.Hash];

	data.SkillTypeText = textmap[obj['1'].SkillTypeDesc.Hash];
	data.MaxLevel = obj['1'].MaxLevel;

	data.Effect = global.replaceParams(textmap[obj['1'].SkillDesc.Hash], obj['1'].ParamList);
	if (textmap[obj['1'].SimpleSkillDesc.Hash])
		data.AbridgedEffect = global.replaceParams(textmap[obj['1'].SimpleSkillDesc.Hash], obj['1'].SimpleParamList);

	data.ElementType = obj['1'].StanceDamageType;

	return data;
}


module.exports = collate;