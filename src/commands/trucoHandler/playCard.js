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

    const cardPlayed = game.jugarCarta(e.user.id, card_code);

    if (!cardPlayed.success) return e.editReply({ content: cardPlayed.message, flags: MessageFlags.Ephemeral });

    const card = cardPlayed.data;

    const card_name = card.getApodo() ? `${card.getApodo()}: \`${card.card_name}\`` : card.card_name;

    const anotherPlayer_data = game.getAnotherPlayer(e.user.id);
    const anotherPlayer = anotherPlayer_data.data;
    if (!anotherPlayer_data.success) return await e.reply({ content: anotherPlayer_data.message, flags: MessageFlags.Ephemeral });

    e.followUp({ content: `<@${anotherPlayer.id}>, ${e.user.username} ha jugado un ${card_name}.` });

    if (game.table.length % 2 == 0) {
        const winRound = game.matarMano(e.user.id);
        console.log(winRound);
        if (!winRound.success) return e.editReply({ content: winRound.message, flags: MessageFlags.Ephemeral });
        return e.followUp({ content: winRound.message });
    }
};