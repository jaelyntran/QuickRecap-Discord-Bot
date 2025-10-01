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

			if (client.messageBuffer[channelId].length >= 50) {
				try {
					const summaryChunks = await handleCommand(client.messageBuffer[channelId]);
					await message.channel.send(`📝 **Auto-summary of the last 50 messages**`);

					summaryChunks.forEach((chunk, index) => {
					    const isLast = index === summaryChunks.length - 1;
                        const chunkNumber = index + 1;
                        const totalChunks = summaryChunks.length;

                        const messageContent = `**Part ${chunkNumber}/${totalChunks}:**\n${chunk}`
                                             + (isLast ? `\n**--- End of summary ---**` : '');

                        message.channel.send(messageContent);
                    });
				} catch (err) {
					console.error(err);
				}
				client.messageBuffer[channelId] = [];
			}
		}
	},
};
