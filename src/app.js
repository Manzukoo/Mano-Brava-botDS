const fs = require('node:fs');
const path = require('node:path');

const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
] });
client.commands = new Collection();
client.cooldowns = new Collection();
client.actitudIa = new Collection();
client.games = new Collection();

const commandsFolder = path.join(__dirname, 'commands');
const commandsNames = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.command.js'));

for (const file of commandsNames) {
    const cmdPath = path.join(commandsFolder, file);
    const cmd = require(cmdPath);

    if ('data' in cmd && 'execute' in cmd) {
        client.commands.set(cmd.data.name, cmd);
        console.log(`✅ >>   El comando ${cmd.data.name} se pudo cargar correctamente.`);
    }
    else {
        console.log(`⚠️ >>   { ${cmdPath} } no se cargó correctamente.`);
    }
}

const eventsFolder = path.join(__dirname, 'events');
const eventsNames = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.event.js'));

for (const file of eventsNames) {
    const eventPath = path.join(eventsFolder, file);
    const event = require(eventPath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);