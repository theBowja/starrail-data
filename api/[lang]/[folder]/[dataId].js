const { getDataItem } = require('../../../main.js');

export default function handler(request, response) {
	const { lang, folder, dataId } = request.query;
	
	const result = getDataItem(lang, folder, dataid);
	return response.json(result);
}