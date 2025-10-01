import { Events } from 'discord.js';
import { handleCommand } from '../utils.js';

export default {
	name: Events.MessageCreate,
	async execute(message, client) {
		if (message.author.bot) return;

		const channelId = message.channel.id;

		if (client.autoSummaryChannels[channelId]) {
			if (!client.messageBuffer[channelId]) {
			    client.messageBuffer[channelId] = [];
			}

            client.messageBuffer[channelId].push({
                    username: message.author.username,
                    content: message.content,
            });

            console.log(
                    `Stored raw: ${message.author.username}: ${message.content} | Total = ${client.messageBuffer[channelId].length}`
            );

			if (client.messageBuffer[channelId].length >= 30) {
				try {
					const summaryChunks = await handleCommand(client.messageBuffer[channelId]);
					await message.channel.send(`📝 **Auto-summary of the last 30 messages:**`);
					for (const chunk of summaryChunks) {
                        await message.channel.send({ content: chunk });
                    }
				} catch (err) {
					console.error(err);
				}
				client.messageBuffer[channelId] = [];
			}
		}
	},
};
