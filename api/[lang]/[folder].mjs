import { getDataAll } from '../../main.js';

export default function handler(request, response) {
	if (!enableCors(request, response)) return;
	
	const { lang, folder } = request.query;
	
	const result = getDataAll(lang, folder);
	return response.json(result);
}

function enableCors(req, res) {
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'folder-type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	)
	if (req.method === 'OPTIONS') {
		res.status(200).end();
	return false;
	}
	return true;
}
