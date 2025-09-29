import 'dotenv/config';
import { REST, Routes } from 'discord.js';

console.log('Token:', process.env.DISCORD_TOKEN);
console.log('App ID:', process.env.APP_ID);
console.log('Guild ID:', process.env.GUILD_ID);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
async function clearGuildCommands() {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: [] } // empty array removes all guild commands
        );
        console.log('✅ All guild commands cleared.');
    } catch (err) {
        console.error(err);
    }
}

clearGuildCommands();

async function clearGlobalCommands() {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            { body: [] } // empty array removes all global commands
        );
        console.log('✅ All global commands cleared.');
    } catch (err) {
        console.error(err);
    }
}

clearGlobalCommands();