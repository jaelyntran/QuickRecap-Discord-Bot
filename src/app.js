import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { handleCommand, summarizeMessages } from "./utils.js";
import { commands } from './commands.js';
import { REST, Routes } from 'discord.js';


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function main() {
    try {
        console.log("Registering slash commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("✅ Slash commands registered.");
    } catch (err) {
        console.error(err);
    }
}

main();


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const autoSummaryChannels = {};
const messageBuffer = {};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('interactionCreate', async(interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'summarize') {
        const count = interaction.options.getInteger('count') || 100;
        if(count > 300) {
            await interaction.reply('⚠️ Please enter an amount of less than 300 messages.');
        } else {
            try {
                const summary = await handleCommand(interaction.channel, count);
                await interaction.reply(summary || '⚠️ Could not generate summary.');
            } catch (err) {
                console.error(err);
                await interaction.reply('❌ Error while summarizing messages.');
            }
        }
    }

    if(interaction.commandName === 'autosummarize') {
        const mode = interaction.options.getString('mode');
        if (mode === 'on') {
            autoSummaryChannels[interaction.channel.id] = true;
            await interaction.reply(`✅ Auto-summarization is now on for this channel.`);
        }
        else {
            autoSummaryChannels[interaction.channel.id] = false;
            await interaction.reply(`❌ Auto-summarization is now off for this channel.`);
        }
    }
})

client.on('messageCreate', async(message) => {
    if(message.author.bot) return;

    const channelId = message.channel.id;

    // Only track messages if auto summary is on for current channel
    if(autoSummaryChannels[channelId]) {
        // Create a message buffer if none existed
        if(!messageBuffer[channelId]) messageBuffer[channelId] = [];
        messageBuffer[channelId].push(`${message.author.username}: ${message.content}`);

        if(messageBuffer[channelId].length > 100) {
            const text = messageBuffer[channelId].join('\n');

            try {
                const summary = await summarizeMessages(text);
                await message.channel.send(`📝 **Auto-summary of last 100 messages:**\n${summary}`)
            } catch (err) {
                console.error(err);
            }

            messageBuffer[channelId] = [];
        }
    }
})

client.login(process.env.DISCORD_TOKEN);