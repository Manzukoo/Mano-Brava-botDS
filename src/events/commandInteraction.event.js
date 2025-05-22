const { Events, Collection, MessageFlags } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: Events.InteractionCreate,
    async execute(e) {
        const { cooldowns } = e.client;
        const uid = e.user.id, gid = e.guild.id;
        if (!e.isChatInputCommand()) return;


    const cmd = e.client.commands.get(e.commandName);
    if (!cmd) return console.error(`❌ >>   No se encontró el comando ${e.commandName}.`);

    if (!cooldowns.has(cmd.data.name)) cooldowns.set(cmd.data.name, new Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.data.name);
    const defaultCooldownDuration = 60;
    const cooldownDuration = (cmd.cooldown ?? defaultCooldownDuration) * 1000;
    const cooldownId = `${uid}-${gid}`;
    const userCooldown = timestamps.get(cooldownId);
    if (userCooldown) {
        const expirationTime = userCooldown + cooldownDuration;

        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            await e.reply({ content: `Por favor, para volver a ejecutar el comando \`${cmd.data.name}\`. podrás volver a usar el comando <t:${expiredTimestamp}:R>`, flags: MessageFlags.Ephemeral });
            await wait(cooldownDuration);
            await e.editReply({ content: `Ya puedes utilizar el comando \`${cmd.data.name}\`.`, flags: MessageFlags.Ephemeral });
            return;
        }
    }
    timestamps.set(cooldownId, now);
    setTimeout(async () => timestamps.delete(e.user.id), cooldownDuration);

    try {
        console.log(`✅ >>   Comando ${e.commandName} ejecutado correctamente.`);
        await cmd.execute(e);
    }
    catch (err) {
        console.error(err);
        if (e.replied || e.deferred) {
            await e.followUp({ content: '¡Hubo un error al tratar de ejecutar este comando!', flags: MessageFlags.Ephemeral });
        }
        else {
            await e.reply({ content: '¡Hubo un error al tratar de ejecutar este comando!', flags: MessageFlags.Ephemeral });
        }
    }
    },
};