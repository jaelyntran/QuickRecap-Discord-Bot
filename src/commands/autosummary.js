import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('autosummary')
		.setDescription('Enable or disable auto summary per 30 messages in this channel')
		.addStringOption(option =>
			option.setName('mode')
				.setDescription('Turn auto-summary on or off')
				.setRequired(true)
				.addChoices(
					{ name: 'on', value: 'on' },
					{ name: 'off', value: 'off' }
				)
		),
	async execute(interaction) {
	    console.log('AutoSummary mode set')
		const mode = interaction.options.getString('mode');
		const { autoSummaryChannels } = interaction.client;

		autoSummaryChannels[interaction.channel.id] = (mode === 'on');

		await interaction.reply(
			mode === 'on'
				? '✅ Auto-summary is now on for this channel.'
				: '❌ Auto-summary is now off for this channel.'
		);
	},
};