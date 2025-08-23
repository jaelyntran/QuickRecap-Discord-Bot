import { SlashCommandBuilder } from 'discord.js';

export const commands = [
    new SlashCommandBuilder()
        .setName('summarize')
        .setDescription('Summarizes the last N messages in this channel (up to 500)')
        .addIntegerOption(option =>
            option.setName("count")
                .setDescription("Number of messages to summarize (default 100)")
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('autosummarize')
        .setDescription('Enable or disable auto summarization per 100 messages in this channel')
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("Turn auto-summary on or off")
                .setRequired(true)
                .addChoices(
                    { name: "on", value: "on" },
                    { name: "off", value: "off" }
                )
        )
]
