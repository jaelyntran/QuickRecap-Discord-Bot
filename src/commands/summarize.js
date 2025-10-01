import { SlashCommandBuilder } from 'discord.js';
import { handleCommand, fetchMessages } from '../utils.js';

export default {
	data: new SlashCommandBuilder()
		.setName('summarize')
		.setDescription('Summarizes the last N messages in this channel (up to 200)')
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('Number of messages to summarize (default 100)')
				.setRequired(false)
		),
	async execute(interaction) {
	    console.log('Summarize message');
		await interaction.deferReply();
		const count = interaction.options.getInteger('count') || 100;

		if (count > 200) {
			return interaction.editReply('⚠️ Please enter an amount less than 200.');
		}

		try {
		    const fetched = await fetchMessages(interaction.channel, count);
			const summaryChunks = await handleCommand(fetched);

			if (summaryChunks.length === 0) {
                await interaction.editReply('⚠️ Could not generate summary.');
                return;
            }

            await interaction.editReply('📝 Summary generated in multiple parts:');
            for (const chunk of summaryChunks) {
                await interaction.followUp(chunk);
            }
		} catch (err) {
			console.error(err);
			await interaction.editReply('❌ Error while summarizing messages.');
		}
	},
};