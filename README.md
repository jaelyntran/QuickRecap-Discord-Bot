This project contains a message summary Discord app written in JavaScript

## Inviting the Bot to the Server (No Setup Required)
You can invite the hosted version of this bot directly to your server.

1. Click the invite link below:
https://discord.com/oauth2/authorize?client_id=1408282486424862822

2. Select the server you want to add the bot to.
   
3. Once invited, you can start using the /summarize and /autosummary command in any text channel.


## Self-Host the Bot 
If you want to run your own copy of the bot:

1. Clone the repository
```git clone https://github.com/jaelyntran/QuickRecap-Discord-Bot```
After cloning, navigate to the new directory:
```cd QuickRecap-Discord-Bot```

2. Check if node exists by running
```node -v```

If not installed:
- Download Node.js from nodejs.org (LTS version recommended).
- Follow the installer instructions (npm is bundled with Node.js)

3. Install all required packages listed in the package.json file
```npm install```
   
4. Set up environment variables
Create a .env file in the project root with the following:
```
APP_ID=your-app-id
GUILD_ID=your-guild-id # optional (use for testing in one server; leave blank for global commands)
DISCORD_TOKEN=your-bot-token
PUBLIC_KEY=your-public-key
```

5. Deploy slash commands
```node src/deploy-commands.js```

6. Run the bot locally
```node src/app.js```
* Global commands can take up to an hour to update.

To clear all commands, run
```node src/clear-commands.js```

