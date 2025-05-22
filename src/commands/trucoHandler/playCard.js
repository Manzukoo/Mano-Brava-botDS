const { MessageFlags } = require("discord.js");

module.exports = async (e, card_code) => {
    await e.deferReply();

    const games = e.client.games;
    let game;
    for (const obj of games.values()) {
        if (obj.players.has(e.user.id)) {
            game = games.get(obj.gameId); // Guardamos la partida donde está el usuario.
            break;
        }
    }

    if (!game) return e.editReply({ content: `Primero debes unirte a una partida de truco.\n¡Utiliza el comando\`\`/truco\`\` y unete o crea una!.`, flags: MessageFlags.Ephemeral });
    if (!game.players.get(e.user.id).turn) return e.editReply({ content: `No es tu turno.`, flags: MessageFlags.Ephemeral });
    if (!card_code) return e.editReply({ content: `Hubo un error al intentar obtener la carta.`, flags: MessageFlags.Ephemeral });

    const cardPlayed = game.jugarCarta(e.user.id, card_code);
    if (!cardPlayed) return e.editReply({ content: `No se pudo jugar la carta.`, flags: MessageFlags.Ephemeral });

    const card_name = cardPlayed.getApodo() ? `${cardPlayed.getApodo()}: \`${cardPlayed.card_name}\`` : cardPlayed.card_name;
    const anotherPlayer = game.getAnotherPlayer(e.user.id);

    e.followUp({ content: `<@${anotherPlayer.id}>, ${e.user.username} ha jugado un ${card_name}.` });

    if (game.table.length % 2 == 0) {
        const winRound = game.matarMano(e.user.id);
        console.log(winRound);
        if (!winRound) {
            return e.editReply({ content: `No se pudo completar la acción para matar la carta del oponente.`, flags: MessageFlags.Ephemeral });
        }
        if (winRound.uId === e.user.id) {
            return e.followUp({ content: `<@${anotherPlayer.id}>, ${e.user.username} te ha matado la carta \`${winRound.card_defeat}\` con un \`${winRound.card_win}\`.` });
        }
        e.followUp({ content: `<@${anotherPlayer.id}>, has matado la carta de ${e.user.username} \`${winRound.card_defeat}\` con un \`${winRound.card_win}\`.` });
    }
};