require('../global.js');

const xrset = getExcel('RelicSetConfig');
const xrskill = getExcel('RelicSetSkillConfig');
const xrdata = getExcel('RelicDataInfo');
const xrtype = getExcel('RelicBaseType');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xrset).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.SetName.Hash];

		data.IsPlanarOrnament = !!obj.IsPlanarSuit;

		data.SetEffects = obj.SetSkillList.reduce((setEffects, pieceNum) => {
			const setObj = xrskill[id][pieceNum];
			setEffects[`Pieces${pieceNum}`] = global.replaceParams(language[global.GetStableHash(setObj.SkillDesc)], setObj.AbilityParamList);
			return setEffects;
		}, {});

		data.Pieces = {};
		if (xrdata[id].HEAD) data.Pieces.Head = getPieceData(language, xrdata[id].HEAD)
		if (xrdata[id].HAND) data.Pieces.Hands = getPieceData(language, xrdata[id].HAND)
		if (xrdata[id].BODY) data.Pieces.Body = getPieceData(language, xrdata[id].BODY)
		if (xrdata[id].FOOT) data.Pieces.Feet = getPieceData(language, xrdata[id].FOOT)
		if (xrdata[id].NECK) data.Pieces.PlanarSphere = getPieceData(language, xrdata[id].NECK)
		if (xrdata[id].OBJECT) data.Pieces.LinkRope = getPieceData(language, xrdata[id].OBJECT)

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

function getPieceData(textmap, relicObj) {
	const relicData = {
		RelicType: relicObj.Type,
		RelicTypeText: textmap[xrtype[relicObj.Type].BaseTypeText.Hash],
		Name: textmap[global.GetStableHash(relicObj.RelicName)],
		Description: textmap[global.GetStableHash(relicObj.ItemBGDesc)].replaceAll('\\n', '\n'),
		// BackstoryTitle: textmap[global.GetStableHash(relicObj.BGStoryTitle)], // same as Name. except for typos.
		Backstory: textmap[global.GetStableHash(relicObj.BGStoryContent)],
	};
	// if (relicData.Name !== relicData.BGStoryTitle) console.log(relicData);
	return relicData;
}

module.exports = collate;