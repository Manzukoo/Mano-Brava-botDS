const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const menu = require('./trucoHandler/menu');

module.exports = {
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName('truco')
		.setDescription('Abrir menu para el truco.'),
	async execute(e) {
			await e.reply({
				content: `Que quieres hacer?`,
				components: [menu(e)],
				flags: MessageFlags.Ephemeral,
			});
	},
};