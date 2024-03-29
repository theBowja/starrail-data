exportStarRailData();

function exportStarRailData() {
	const { setVersion, exportCurve, exportData } = require('./global.js');

	setVersion('2.0');

	exportData('characters', require('./extractfolders/extractCharacters'));
	exportData('characterskills', require('./extractfolders/extractCharacterSkills'));
	exportData('charactertraces', require('./extractfolders/extractCharacterTraces'));
	exportData('lightcones', require('./extractfolders/extractLightCones'));
	exportData('relicsets', require('./extractfolders/extractRelicSets'));

	exportData('elements', require('./extractfolders/extractElements'));
	exportData('paths', require('./extractfolders/extractPaths'));

	exportData('enemies', require('./extractfolders/extractEnemies'));

	exportData('warps', require('./extractfolders/extractWarps'));
	exportData('travellogs', require('./extractfolders/extractTravelLogs'));
	exportData('trailblazelevels', require('./extractfolders/extractTrailblazeLevels'));
	exportData('achievements', require('./extractfolders/extractAchievements'));
	// exportData('items', require('./extractfolders/extractItems'));

	exportData('loadingtips', require('./extractfolders/extractLoadingTips'));

	exportData('messagecontacts', require('./extractfolders/extractMessageContacts'));
	exportData('messageconversations', require('./extractfolders/extractMessageConversations'));

	// Simulated Universe
	exportData('sucurios', require('./extractfolders/extractSUCurios'));
	exportData('sublessings', require('./extractfolders/extractSUBlessings'));
	exportData('suabilities', require('./extractfolders/extractSUAbilities'));
}