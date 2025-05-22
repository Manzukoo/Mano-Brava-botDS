const { Events, PresenceUpdateStatus } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(e) {
        console.log(`🚀 >>   Bot ${e.user.tag} encendido.`);
        e.user.setPresence({ activities: [{ name: 'con tu hermana' }], status: PresenceUpdateStatus.DoNotDisturb });
    },
};