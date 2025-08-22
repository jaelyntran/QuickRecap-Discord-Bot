import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { summarizeMessages } from "./utils.js";

// Create a Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('interactionCreate', async(interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'summarize') {
        const count = interaction.options.getInteger('count') || 100;
        const summary = await summarizeMessages(interaction.channel, count);
        await interaction.reply(summary);
    }

    if(interaction.commandName === 'autosummarize') {
        const mode = interaction.options.getString('mode');
        autoSummaryChannels[interaction.channel.id] = mode === 'on';
        await interaction.reply(`✅ Auto-summarization is now **${mode}** for this channel.`);
    }
})

client.login(process.env.DISCORD_TOKEN);