import { searchDataProps } from '../../../../main.js';

export default function handler(request, response) {
	const { lang, folder, query } = request.query;
	
	const result = searchDataProps(lang, folder, query);
	return response.json(result);
}