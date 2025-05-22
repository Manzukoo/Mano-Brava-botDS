const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

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
        return e.followUp({ content: `Primero debes unirte a una partida de truco.\n¡Utiliza el comando\`\`/truco\`\` y unete o crea una!.`, flags: MessageFlags.Ephemeral });
    }

    const row = new ActionRowBuilder();

    const cards = game.players.get(e.user.id).hand;
    cards.map(card => {
        const cardBtn = new ButtonBuilder()
            .setCustomId('card_code:' + card.card_code)
            .setLabel(card.card_name)
            .setStyle(ButtonStyle.Primary);
        return row.addComponents(cardBtn);
    });

    await e.update({
        content: `¿Que carta quieres jugar?`,
        components: [row],
    });
};