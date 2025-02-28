require('../global.js');

const xcontact = getExcel('MessageContactsConfig');
const xmtype = getExcel('MessageContactsType');
const xmcamp = getExcel('MessageContactsCamp');
const xmgroup = getExcel('MessageGroupConfig');

function collate(langCode) {
	const language = getLanguage(langCode);
	const mydata = Object.entries(xcontact).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;
		let filename = id;

		data.Name = language[obj.Name.Hash];
		if (obj.SignatureText) {
			data.Signature = language[obj.SignatureText.Hash];
		}

		data.ContactType = obj.ContactsType;
		data.ContactTypeText = language[xmtype[obj.ContactsType]?.Name?.Hash];

		data.FactionType = obj.ContactsCamp;
		data.FactionTypeText = language[xmcamp[obj.ContactsCamp]?.Name?.Hash];

		data.ConversationIds = Object.values(xmgroup).filter(e => e.MessageContactsID+'' === id).map(e => e.ID+'');

		data.Images = {
			Icon: obj.IconPath
		}

		accum[filename] = data;
		return accum;
	}, {});

	return mydata;
}

module.exports = collate;