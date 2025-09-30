import { SlashCommandBuilder } from 'discord.js';
import { handleCommand } from '../utils.js';

export default {
	data: new SlashCommandBuilder()
		.setName('summarize')
		.setDescription('Summarizes the last N messages in this channel (up to 300)')
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('Number of messages to summarize (default 100)')
				.setRequired(false)
		),
	async execute(interaction) {
	    console.log('Summarize message');
		await interaction.deferReply();
		const count = interaction.options.getInteger('count') || 100;

		if (count > 300) {
			return interaction.editReply('⚠️ Please enter an amount less than 300.');
		}

		try {
			const finalText = await handleCommand(interaction.channel, count);
			console.log(finalText);

			if (finalText.length === 0) {
                await interaction.editReply('⚠️ Could not generate summary.');
                return;
            }

            await interaction.editReply(finalText);
		} catch (err) {
			console.error(err);
			await interaction.editReply('❌ Error while summarizing messages.');
		}
	},
};