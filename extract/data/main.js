exportStarRailData();

function exportStarRailData() {
	const { setVersion, exportCurve, exportData } = require('./global.js');

	setVersion('1.0');

	exportData('characters', require('./extractfolders/extractCharacters'), undefined, false);
	exportData('lightcones', require('./extractfolders/extractLightCones'));

	exportData('elements', require('./extractfolders/extractElements'));
	exportData('paths', require('./extractfolders/extractPaths'));

	exportData('enemies', require('./extractfolders/extractEnemies'));

	exportData('achievements', require('./extractfolders/extractAchievements'));

	// Simulated Universe
	exportData('sucurios', require('./extractfolders/extractSUCurios'));
	exportData('sublessings', require('./extractfolders/extractSUBlessings'));
}