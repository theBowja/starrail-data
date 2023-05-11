import { getDataAll } from '../../main.js';

export default function handler(request, response) {
	const { lang, folder } = request.query;
	
	const result = getDataAll(lang, folder);
	return response.json(result);
}