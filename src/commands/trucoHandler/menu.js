const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = (e) => {
    const games = e.client.games;
    let game_id, players;
    let usuarioEnPartida = false;
    for (const obj of games.values()) {
        if (obj.players.has(e.user.id) && obj.guildId === e.guild.id) {
            usuarioEnPartida = true;
            game_id = obj.gameId;
            players = obj.players;
            break;
        }
    }
    const row = new ActionRowBuilder();

    if (!usuarioEnPartida) {
        const startBtn = new ButtonBuilder()
            .setCustomId('create')
            .setLabel('Crear partida')
            .setStyle(ButtonStyle.Primary);

        const joinBtn = new ButtonBuilder()
            .setCustomId('join')
            .setLabel('Unirse a una partida')
            .setStyle(ButtonStyle.Primary);

        const rulesBtn = new ButtonBuilder()
            .setCustomId('rules')
            .setLabel('Ver reglas del juego')
            .setStyle(ButtonStyle.Secondary);

        row.addComponents(startBtn, joinBtn, rulesBtn);
    }
    else {
        const jugarCartaBtn = new ButtonBuilder()
            .setCustomId('playCard')
            .setLabel('Jugar carta')
            .setStyle(ButtonStyle.Primary);

        const trucoBtn = new ButtonBuilder()
            .setCustomId('truco')
            .setLabel('Desafiar truco')
            .setStyle(ButtonStyle.Primary);

        const envidoBtn = new ButtonBuilder()
            .setCustomId('envido')
            .setLabel('Desafiar envido')
            .setStyle(ButtonStyle.Primary);

        const cartasBtn = new ButtonBuilder()
            .setCustomId('cartas')
            .setLabel('Ver cartas')
            .setStyle(ButtonStyle.Secondary);

        const leaveBtn = new ButtonBuilder()
            .setCustomId('leave')
            .setLabel('Abandonar partida ' + game_id)
            .setStyle(ButtonStyle.Danger);

        if (players.size < 2) {
            trucoBtn.setDisabled(true);
            jugarCartaBtn.setDisabled(true);
            envidoBtn.setDisabled(true);
            cartasBtn.setDisabled(true);
        }
        row.addComponents(jugarCartaBtn, trucoBtn, envidoBtn, cartasBtn, leaveBtn);
    }
    return row;
};