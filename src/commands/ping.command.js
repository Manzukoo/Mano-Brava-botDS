const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Probando probando!'),
	async execute(interaction) {
		try {
            // Solo podemos borrar hasta 100 mensajes a la vez con la API
            const mensajesABorrar = 20;

            // Fetch de los últimos mensajes (incluyendo el del comando)
            const mensajes = await interaction.channel.messages.fetch({ limit: mensajesABorrar });

            // Filtrar los mensajes que se pueden borrar (no son mensajes fijados y tienen menos de 14 días)
            const mensajesBorrables = mensajes.filter(msg => !msg.pinned && (Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000));

            if (mensajesBorrables.size === 0) {
                return await interaction.reply({ content: 'No se encontraron mensajes borrables en los últimos 20.', ephemeral: true });
            }

            await interaction.channel.bulkDelete(mensajesBorrables, true) // bulkDelete soporta hasta 100 mensajes y evita errores con mensajes antiguos
                .then(async (borrados) => {
                    await interaction.reply({ content: `Se borraron ${borrados.size} mensajes.`, ephemeral: true });
                })
                .catch(async (error) => {
                    console.error('Error al borrar mensajes:', error);
                    await interaction.reply({ content: 'Hubo un error al intentar borrar los mensajes.', ephemeral: true });
                });

        } catch (error) {
            console.error('Error general al borrar mensajes:', error);
            await interaction.reply({ content: 'Hubo un error al intentar borrar los mensajes.', ephemeral: true });
        }

	},
};