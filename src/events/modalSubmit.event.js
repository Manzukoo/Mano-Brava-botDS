const { Events, MessageFlags } = require('discord.js');
const menu = require('../commands/trucoHandler/menu');

module.exports = {
    name: Events.InteractionCreate,
    async execute(e) {
        if (!e.isModalSubmit()) return;

        if (e.customId === 'modal_game_id') {
            const games = e.client.games;
            const game_id = e.fields.getTextInputValue('game_id');
            const game = games.get(game_id);

            // Verificamos que el host de la partida no esté en otra partida.
            let usuarioEnPartida = false;
            for (const obj of games.values()) {
                if (obj.players.has(e.user.id) && obj.guildId === e.guild.id) {
                    usuarioEnPartida = true;
                    break;
                }
            }

            if (usuarioEnPartida) {
                return await e.reply({
                    content: `Primero debes abandonar la partida de truco en la que estás participando.\nUtiliza el comando\`\`/truco\`\` y dale click al botón rojo que dice abandonar.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            if (!game || game.channelId != e.channelId) {
                return await e.reply({ content: `La partida con ID: \`${game_id}\` no existe.`, flags: MessageFlags.Ephemeral });
            }

            if (game.players.size > 1) {
                return await e.reply({ content: `La partida a la que has intentado unirte está llena. \`2/2\``, flags: MessageFlags.Ephemeral });
            }

            game.addPlayer(e.user.id, e.user.username);
            const another_player = game.getAnotherPlayer(e.user.id);
            const repartir = game.repartirCartas();
            await e.update({ content: `Te has unido a la partida de ${another_player.username}.`, components: [menu(e)] });
            await e.followUp({
                content: `<@${another_player.id}>, <@${e.user.id}> se ha unido a tu partida.`,
            });
            if (repartir) console.log("Se repartió.");
            else console.log("No se repartió.");

            console.log(game.players);
        }
    },
};
