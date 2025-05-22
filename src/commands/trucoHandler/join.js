const { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder } = require('discord.js');

module.exports = async (e) => {
    const modal = new ModalBuilder()
        .setCustomId('modal_game_id')
        .setTitle('Unirse a una partida de truco');
    const input = new TextInputBuilder()
        .setCustomId('game_id')
        .setLabel('Id de la partida')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Ingrese el ID');

    const actionRow = new ActionRowBuilder().addComponents(input);

    modal.addComponents(actionRow);
    await e.showModal(modal);
};