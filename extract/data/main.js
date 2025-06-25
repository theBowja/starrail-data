const fs = require('fs');
const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(2), {
    string: [ 'version' ],
});

exportStarRailData();

function exportStarRailData() {
	const { setVersion, getVersion, exportCurve, exportData } = require('./global.js');

	console.log(argv);
	if (argv.version) {
		// parse out version from commit message
		const matches = argv.version.match(/OSPRODWin(\d*?\.\d*?)\..*/i);
		if (!matches || !matches[1]) return; // invalid commit
		console.log(matches[1]);

		setVersion(matches[1]);

		const config = require('../config.json');
		config.StarRailData_folder = path.resolve(__dirname, '../../StarRailData');
		config.starrail_export_folder = path.resolve(__dirname, '../../data');

	} else {
		return; // i dont do this manually anymore
		setVersion('2.6');
	}

	if (getVersion() === '' || !getVersion()) {
		console.log(`version failed to parse`);
		return;
	}

	fs.writeFileSync(path.resolve(__dirname, '../../StarRailData.version'), getVersion());

	exportData('characters', require('./extractfolders/extractCharacters'));
	exportData('characterskills', require('./extractfolders/extractCharacterSkills'));
	exportData('charactertraces', require('./extractfolders/extractCharacterTraces'));
	exportData('lightcones', require('./extractfolders/extractLightCones'));
	exportData('relicsets', require('./extractfolders/extractRelicSets'));

	exportData('elements', require('./extractfolders/extractElements'));
	exportData('paths', require('./extractfolders/extractPaths'));

	// exportData('enemies', require('./extractfolders/extractEnemies'));

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
