const { EmbedBuilder } = require('discord.js');
const Truco = require('../../truco/game.truco');
const menu = require('./menu');

module.exports = async (e) => {
    const games = e.client.games;
    // Verificamos que el host de la partida no esté en otra partida.
    let usuarioEnPartida = false;
    for (const obj of games.values()) {
        if (obj.players.has(e.user.id) && obj.guildId === e.guild.id) {
            usuarioEnPartida = true;
            break;
        }
    }

    if (usuarioEnPartida) {
        return await e.followUp({
            content: `Primero debes abandonar la partida de truco en la que estás participando.\nUtiliza el comando\`\`/truco\`\` y dale click al botón rojo que dice abandonar.`,
        });
    }
    const gameId = Math.random().toString(36).substring(2, 15);

    const newGame = new Truco(gameId, e.guild.id, e.channelId);
    newGame.addPlayer(e.user.id, e.user.username);
    games.set(gameId, newGame);

    const embed_publicMsg = new EmbedBuilder()
    .setColor('#1f6e3a')
    .setTitle('-- Partida de truco creada --')
    .setAuthor({ name: e.user.username, iconURL: e.user.displayAvatarURL() })
    .setDescription(`Se creó correctamente la __partida de truco__, ahora debes esperar a que un rival se una.
                    Para poder unirse a esta partida se debe ejecutar el comando \`/truco\` y darle click al botón ***unirse***, luego escribir la ID de esta partida: \`${gameId}\`  `)
    .setThumbnail(e.message.author.displayAvatarURL())
    .setFooter({ text: `id: ${gameId}` });

    await e.update({ content: `Partida de truco \`${gameId}\` creada.`, components: [menu(e)] });
    await e.followUp({ embeds: [embed_publicMsg] });
    console.log(games);
};