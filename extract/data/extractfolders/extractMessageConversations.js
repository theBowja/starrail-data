require('../global.js');

const xcontact = getExcel('MessageContactsConfig');
const xmgroup = getExcel('MessageGroupConfig');
const xmsection = getExcel('MessageSectionConfig');
const xmitem = getExcel('MessageItemConfig');
const xmimage = getExcel('MessageItemImage');

function collate(langCode) {
	const textmap = getLanguage(langCode);

	const mydata = Object.entries(xmgroup).reduce((accum, [id, obj]) => {
		const data = {};
		data.Id = id;

		data.ContactId = obj.MessageContactsID+'';
		data.ParticpatingContactIds = new Set(); // converted to array later

		data.Sections = [];
		for (const sectionId of obj.MessageSectionIDList) {
			const sectionObj = xmsection[sectionId];
			const section = {};
			section.Id = sectionId+'';

			const messageItemItems = [];
			if (sectionObj.StartMessageItemIDList.length === 1) {
				section.StartingMessageId = sectionObj.StartMessageItemIDList[0]+'';
				messageItemItems.push(section.StartingMessageId);
			} else if (sectionObj.StartMessageItemIDList.length >= 1) {
				section.StartingMessageId = `choice0`;
				messageItemItems.push(sectionObj.StartMessageItemIDList);
			}

			section.Messages = {};

			for (let [index, messageItemIds] of messageItemItems.entries()) {
				const message = {};

				// is choice message
				if (Array.isArray(messageItemIds)) {
					message.Id = `choice${index}`;
					message.MessageType = 'Choice';
					message.Choices = messageItemIds.map(itemId => {
						return {
							Text: textmap[xmitem[itemId].OptionText.Hash].replaceAll('\\n', '\n').replaceAll('<unbreak>', '').replaceAll('</unbreak>', ''),
							NextMessageId: itemId+''
						};
					});

					messageItemItems.push(...messageItemIds);

				} else {
					const messageObj = xmitem[messageItemIds];
					message.Id = messageItemIds+'';
					message.MessageType = messageObj.ItemType;
					message.SenderType = messageObj.Sender;
					if (messageObj.Sender === 'NPC' && !messageObj.ContactsID) {
						data.ParticpatingContactIds.add(obj.MessageContactsID+'');
						// message.SenderName = textmap[xcontact[obj.MessageContactsID].Name.Hash]
					} else if (messageObj.Sender === 'NPC') {
						data.ParticpatingContactIds.add(messageObj.ContactsID+'');
						// message.SenderName = textmap[xcontact[messageObj.ContactsID].Name.Hash]
					} else {
						data.ParticpatingContactIds.add('8001');
						// message.SenderName = '{NICKNAME}';
					}
					// message.SenderProfilePic = '';

					if (messageObj.ItemType === 'Sticker' || messageObj.ItemType === 'Image') {
						message.Image = xmimage[messageObj.ItemImageID].ImagePath;
					}

					message.Text = textmap[messageObj.MainText.Hash].replaceAll('\\n', '\n').replaceAll('<unbreak>', '').replaceAll('</unbreak>', '');

					if (messageObj.NextItemIDList.length === 1) {
						message.NextMessageId = messageObj.NextItemIDList[0]+'';
						messageItemItems.push(message.NextMessageId+'');
					} else if (messageObj.NextItemIDList.length >= 1) {
						// check if these set of choices haven't already been added
						const ind = messageItemItems.map(e => e.toString()).indexOf(messageObj.NextItemIDList.toString());
						if (ind !== -1) {
							message.NextMessageId = `choice${ind}`;
						} else {
							message.NextMessageId = `choice${messageItemItems.length}`;
							messageItemItems.push(messageObj.NextItemIDList);
						}
					}
				}

				section.Messages[message.Id] = message;
			}


			data.Sections.push(section);
		}

		data.ParticpatingContactIds = Array.from(data.ParticpatingContactIds);

		accum[id] = data;
		return accum;
	}, {});

	return mydata;
}


module.exports = collate;