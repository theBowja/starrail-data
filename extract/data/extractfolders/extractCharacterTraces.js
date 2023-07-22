require('../global.js');

const xchar = getExcel('AvatarConfig');
const xtrace = getExcel('AvatarSkillTreeConfig');
const xtprop = getExcel('AvatarPropertyConfig');
const xitem = getExcel('ItemConfig');
const xskill = getExcel('AvatarSkillConfig');

const statBonusHash = "-1039879996";
const bonusAbilityHash = "1842980950";

function collate(langCode) {
	const textmap = getLanguage(langCode);
	const mydata = Object.entries(xtrace).reduce((accum, [id, obj]) => {
		const charId = obj['1'].AvatarID+'';
		if (!accum[charId]) accum[charId] = { Id: charId, Name: textmap[xchar[charId].AvatarName.Hash], Nodes: {} };

		const levelone = obj['1'];
		const nodeData = {};
		nodeData.Id = id;
		let filename = id;

		nodeData.Name = ''; // temp
		nodeData.NodeType = levelone.PointType;
		if (levelone.PointType === 1) { // minor traces
			nodeData.Name = textmap[global.GetStableHash(levelone.PointName)];
			nodeData.NodeTypeText = textmap[statBonusHash];

			if (levelone.StatusAddList.length !== 1) console.log(`Error: node has more than 1 stat bonuses ${id}`);
			const prop = levelone.StatusAddList[0];
			nodeData.EffectRaw = textmap[xtprop[prop.PropertyType].PropertyNameSkillTree.Hash].replaceAll('\\n', '\n');
			nodeData.MaxLevel = levelone.MaxLevel;
			nodeData.StatBonusType = prop.PropertyType;
			nodeData.StatBonusValue = global.roundFloat(prop.Value.Value);

		} else if (levelone.PointType === 2) { // skills
			const skillObj = xskill[levelone.LevelUpSkillID[0]]['1'];
			nodeData.Name = textmap[skillObj.SkillName.Hash];
			nodeData.NodeTypeText = textmap[skillObj.SkillTypeDesc.Hash];

			nodeData.EffectRaw = textmap[skillObj.SkillDesc.Hash]?.replaceAll('\\n', '\n');
			nodeData.MaxLevel = levelone.MaxLevel;

			// some traces level more than one skills. corresponding to enhanced versions of skills
			nodeData.LeveledSkillIds = levelone.LevelUpSkillID.map(e => e+'');

		} else if (levelone.PointType === 3) { // major traces
			nodeData.Name = textmap[global.GetStableHash(levelone.PointName)];
			nodeData.NodeTypeText = textmap[bonusAbilityHash];

			nodeData.EffectRaw = textmap[global.GetStableHash(levelone.PointDesc)]?.replaceAll('\\n', '\n');
			nodeData.MaxLevel = levelone.MaxLevel;

		} else {
			console.log(`Error: unknown node type ${levelone.PointType} for trace node ${id}`);
		}

		nodeData.Location = levelone.Anchor;
		nodeData.ImageIcon = levelone.IconPath;

		nodeData.Levels = {};
		for (let level = 1; level <= levelone.MaxLevel; level++) {
			nodeData.Levels[level] = {};

			if (obj[level].PointType === 1) { // minor traces
				nodeData.Levels[level].EffectValues = global.roundParams([obj[level].StatusAddList[0]]);
			} else if (obj[level].PointType === 2) { // skills
				nodeData.Levels[level].EffectValues = global.roundParams(xskill[obj[level].LevelUpSkillID[0]][level].ParamList.map(e => e.Value));
			} else if (obj[level].PointType === 3) { // major traces
				nodeData.Levels[level].EffectValues = global.roundParams(obj[level].ParamList.map(e => e.Value));
			}

			nodeData.Levels[level].AscensionRequired = obj[level].AvatarPromotionLimit;
			nodeData.Levels[level].LevelRequired = obj[level].AvatarLevelLimit;
			nodeData.Levels[level].NodeRequired = obj[level].PrePoint.length === 1 ? obj[level].PrePoint[0]+'' : undefined;
			nodeData.Levels[level].Costs = obj[level].MaterialList.map(i => {
				return {
					Id: i.ItemID+'',
					Name: textmap[xitem[i.ItemID].ItemName.Hash],
					Count: i.ItemNum
				}
			})
		}

		// nodeData.AscensionRequired = levelone.AvatarPromotionLimit;
		// nodeData.LevelRequired = levelone.AvatarLevelLimit;
		// nodeData.NodeRequired = levelone.PrePoint.length === 1 ? levelone.PrePoint[0]+'' : undefined
		if (levelone.PrePoint.length > 1) console.log(`Error: node ${id} has more than one PrePoint`);

		accum[charId].Nodes[id] = nodeData; 
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;