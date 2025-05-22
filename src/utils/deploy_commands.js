const fs = require('node:fs');
const path = require('node:path');

const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { BOT_TOKEN: token, BOT_CLIENT: clientId } = process.env;

const commands = [];

const commandsFolder = path.join(__dirname, '../commands');
const commandNames = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));

for (const cmdName of commandNames) {
    const cmdPath = path.join(commandsFolder, cmdName);
    const cmd = require(cmdPath);

    if ('data' in cmd && 'execute' in cmd) {
        commands.push(cmd.data.toJSON());
        console.log(`✅ >>   El comando ${cmd.data.name} se pudo cargar correctamente.`);
    }
    else {
        console.log(`⚠️ >>   " ${cmdPath} " no se cargó correctamente.`);
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`🔄️ >>   Registrando ${commands.length} comandos interactivos de la aplicación...`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`✅ >>   ${data.length} comandos interactivos de la aplicación registrados correctamente.`);
    }
    catch (err) {
        console.error(err);
    }
})();