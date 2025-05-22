const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('noticia')
		.setDescription('Crear una noticia desde web.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};