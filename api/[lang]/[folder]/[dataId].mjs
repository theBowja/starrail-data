import { getDataItem } from '../../../main.js';

export default function handler(request, response) {
	const { lang, folder, dataId } = request.query;
	
	const result = getDataItem(lang, folder, dataId);
	return response.json(result);
}