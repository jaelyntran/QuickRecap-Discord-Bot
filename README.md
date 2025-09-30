This project contains a message summary Discord app written in JavaScript.

## Inviting the Bot to the Server (No Setup Required)
You can invite the hosted version of this bot directly to your server.

1. Click the invite link: [Invite QuickRecap](https://discord.com/oauth2/authorize?client_id=1408282486424862822)

2. Select the server you want to add the bot to.
   
3. Once invited, you can start using the `/summarize` and `/autosummary` commands in any text channel.

## Self-Host the Bot 
If you want to run your own copy of the bot:

1. Clone the repository ```git clone https://github.com/jaelyntran/QuickRecap-Discord-Bot```
   
2. After cloning, navigate to the new directory ```cd QuickRecap-Discord-Bot```

3. Check if node exists by running ```node -v```. If not installed:
- Download Node.js from nodejs.org (LTS version recommended).
- Follow the installer instructions (npm is bundled with Node.js).

4. Install all required packages listed in the package.json file ```npm install```
   
5. Set up environment variables
Create a .env file in the project root with the following:
```
APP_ID=your-app-id
GUILD_ID=your-guild-id # optional (use for testing in one server; leave blank for global commands)
DISCORD_TOKEN=your-bot-token
PUBLIC_KEY=your-public-key
```

6. Deploy slash commands ```node src/deploy-commands.js```

7. Run the bot locally ```node src/app.js```
* Note: Global commands may take up to an hour to appear on all servers.

8. (Optional) To clear all commands, run ```node src/clear-commands.js```

## Commands Reference
- `/summarize` → Summarizes the last N messages in the current channel (up to 300 messages, default is set to 100).
- `/autosummary` → Automatically summarizes messages once every 100 messages.

## Features
- Summarizes recent messages in a channel.
- Auto-summarizes messages periodically.
- Ignores bot messages.
- Cleans mentions, links, and unnecessary characters from summaries.

## Known Issues / Limitations
- `node-summarizer` relies on word frequency rather than semantic understanding. This can cause messages to appear out of order, truncate large text chunks, or split/omit parts of messages, leading to less accurate summaries.
- Global command registration can take up to 1 hour to propagate across all servers.
- Large message histories require multiple requests and may slow down the bot.

## Takeaway
While `node-summarizer` has clear limitations, it was chosen for its simplicity and zero cost. This allows rapid development and easy deployment without relying on paid APIs. For projects requiring highly accurate, chronological summaries, a more advanced AI-based solution would be preferable.

## Credits / Acknowledgements
- discord.js → Discord bot library
- node-summarizer → Message summarization library
- Inspired by community feedback for simplifying long chat threads
