const { Events } = require('discord.js');
const create = require('../commands/trucoHandler/create');
const join = require('../commands/trucoHandler/join');
const leave = require('../commands/trucoHandler/leave');
const viewCards = require('../commands/trucoHandler/viewCards');
const playCard = require('../commands/trucoHandler/playCard');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(e) {
        if (!e.isButton()) return;
        // interaction.customId contiene el ID único del botón clickeado
        const { customId } = e;

        console.log(`Botón clickeado: ${customId}`);

        // Aquí puedes ejecutar la función basada en el customId
        switch (customId) {
            case 'create':
                await create(e);
            break;
            case 'join':
                await join(e);
            break;
            case 'leave':
                await leave(e);
            break;
            case 'playCard':
                await viewCards(e);
            break;
            default:
                if (customId.startsWith('card_code:')) {
                    const code = customId.split(':')[1];
                    await playCard(e, code);
                }
            break;
        }
    },
};