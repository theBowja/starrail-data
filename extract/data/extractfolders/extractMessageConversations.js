require('../global.js');

const xcontact = getExcel('MessageContactsConfig');
const xmgroup = getExcel('MessageGroupConfig');
const xmsection = getExcel('MessageSectionConfig');
const xmitem = getExcel('MessageItemConfig');
const xmimage = getExcel('MessageItemImage');
const xemoji = getExcel('EmojiConfig');

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
						const choiceData = {};
						choiceData.ChoiceType = xmitem[itemId].ItemType;
						if (xmitem[itemId].ItemType === 'Sticker') {
							choiceData.Image = xemoji[xmitem[itemId].ItemContentID].ImagePath;
						} else if (xmitem[itemId].ItemType === 'Image') {
							choiceData.Image = xmimage[xmitem[itemId].ItemContentID].ImagePath;
						}
						choiceData.Text = textmap[xmitem[itemId].OptionText.Hash].replaceAll('\\n', '\n').replaceAll('<unbreak>', '').replaceAll('</unbreak>', '');
						if (choiceData.Text === undefined && xmitem[itemId].ItemType === 'Sticker') {
							choiceData.Text = `[${textmap[xmimage[xmitem[itemId].ItemContentID].KeyWords.Hash]}]`;
						}
						if (choiceData.Text === undefined) {
							console.log(`choiceData has no text`)
							console.log(choiceData);
						}
						choiceData.NextMessageId = itemId+'';
						return choiceData;
					});

					messageItemItems.push(...messageItemIds);

				} else {
					const messageObj = xmitem[messageItemIds];
					message.Id = messageItemIds+'';
					message.MessageType = messageObj.ItemType;
					message.SenderType = messageObj.Sender;
					if (messageObj.Sender === 'NPC' && !messageObj.ContactsID) {
						message.SenderContactId = obj.MessageContactsID+'';
						data.ParticpatingContactIds.add(obj.MessageContactsID+'');
					} else if (messageObj.Sender === 'NPC') {
						message.SenderContactId = messageObj.ContactsID+'';
						data.ParticpatingContactIds.add(messageObj.ContactsID+'');
					} else {
						message.SenderContactId = '8001';
						data.ParticpatingContactIds.add('8001');
					}

					if (messageObj.ItemType === 'Sticker') {
						message.Image = xemoji[messageObj.ItemContentID].EmojiPath;
					} else if (messageObj.ItemType === 'Image') {
						message.Image = xmimage[messageObj.ItemContentID].ImagePath;
					}

					message.Text = textmap[messageObj.MainText.Hash]?.replaceAll('\\n', '\n').replaceAll('<unbreak>', '').replaceAll('</unbreak>', '');
					if (message.Text === undefined && messageObj.ItemType === 'Sticker') {
						message.Text = `[${textmap[xemoji[messageObj.ItemContentID].KeyWords.Hash]}]`;
					}
					if (message.Text === undefined) {
						console.log(`message has no text`)
						console.log(message);
					}

					if (messageObj.NextItemIDList.length === 0) {
						// do nothing
					} else if (isChoiceMessageItems(textmap, messageObj.NextItemIDList)) {
						// check if these set of choices haven't already been added
						const ind = messageItemItems.map(e => e.toString()).indexOf(messageObj.NextItemIDList.toString());
						if (ind !== -1) {
							message.NextMessageId = `choice${ind}`;
						} else {
							message.NextMessageId = `choice${messageItemItems.length}`;
							messageItemItems.push(messageObj.NextItemIDList);
						}
					} else {
						message.NextMessageId = messageObj.NextItemIDList[0]+'';
						messageItemItems.push(message.NextMessageId+'');
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

function isChoiceMessageItems(textmap, messageItemIds) {
	for (const mItemId of messageItemIds) {
		const text = textmap[xmitem[mItemId].OptionText.Hash];
		if (text !== undefined && text !== '') {
			return true;
		}
	}
	return false;
}

module.exports = collate;