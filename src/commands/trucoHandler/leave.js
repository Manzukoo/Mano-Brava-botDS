const { MessageFlags } = require('discord.js');

module.exports = async (e) => {
    const games = e.client.games;
    let game;
    for (const obj of games.values()) {
        if (obj.players.has(e.user.id)) {
            game = games.get(obj.gameId); // Guardamos la partida donde está el usuario.
            player = game.players;
            break;
        }
    }

    if (!game) {
        await e.deferReply();
        return e.followUp({ content: `No pertences a una partida.`, flags: MessageFlags.Ephemeral });
    }

    games.delete(game.gameId); // Borrar los datos de la partida.

    if (game.players.size > 1) {
        const another_player = game.getAnotherPlayer(e.user.id);
        const player_info = game.players.get(another_player);
        e.channel.send({
            content: `<@${another_player}> ha ganado la partida con \`${player_info.points}\`.`,
        });
    }
    e.channel.send({
        content: `La partida \`${game.gameId}\` ha terminado por el abandono de \`${e.user.username}\`.`,
    });
};