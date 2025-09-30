import { Events } from 'discord.js';
import { summarizeMessages } from '../utils.js';

export default {
	name: Events.MessageCreate,
	async execute(message, client) {
		if (message.author.bot) return;
		console.log(`${message.author.username}: ${message.content}`);

		const channelId = message.channel.id;

		if (client.autoSummaryChannels[channelId]) {
			if (!client.messageBuffer[channelId]) client.messageBuffer[channelId] = [];
			client.messageBuffer[channelId].push(`${message.author.username}: ${message.content}`);

			if (client.messageBuffer[channelId].length > 100) {
				const text = client.messageBuffer[channelId].join('\n');
				try {
					const summary = await summarizeMessages(text);
					await message.channel.send(`📝 **Auto-summary of the last 100 messages:**\n${summary}`);
				} catch (err) {
					console.error(err);
				}
				client.messageBuffer[channelId] = [];
			}
		}
	},
};
