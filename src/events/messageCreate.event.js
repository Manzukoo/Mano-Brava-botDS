const { Events } = require('discord.js');
const initGenerativeModel = require('../helpers/iaInit.helper');
const ia = initGenerativeModel();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.mentions.users.has('912465563480125440')) {
        const msg = await message.reply('Estoy procesando tu mención...');
        // El bot ha sido mencionado

        // Extraer el mensaje después de la mención
        const parts = message.content.split('<@912465563480125440>').filter(part => part.trim() !== '');
        const mensajeRecibido = parts.join(' ').trim();

        const { actitudIa } = message.client;
        const actitud = actitudIa.get(message.guild.id);
        let mensaje = '';
        switch (actitud) {
            case 'ia_buena':
                mensaje = 'tu actitud es buena, sos muy amable, respondes sin maldad y si alguien te responde mal vos lo humillas en publico pero de manera amable.';
            break;
            case 'ia_intermedia':
                mensaje = 'tu actitud es como un viejo, todo te molesta, sos renegado pero caes bien. Si alguien te responde mal vos respondes con algun insulto gracioso.';
            break;
            default:
                mensaje = 'tu actitud es la peor que puede haber, sos muy molesto, insultas mucho y sos muy hiriente. Si alguien te responde mal vos le replicas el mensaje mil veces peor.';
            break;
        }
        if (mensajeRecibido) {
            const prompt = `
            Antes que nada, necesito que uses la jerga Argentina sin modificar ni nada, solamente que sea el lenguaje Argentino con sus palabras y nada mas.
            Te voy a pasar un mensaje, ${mensaje}. Solamente necesito el mensaje de respuesta y necesitaría que tu respuesta sea enviada en el siguiente formato:
            su nombre es ${message.author.username}
            response: {Tu respuesta} (sin llaves)

            ${mensajeRecibido}
            `;
                try {
                    const response = await ia.generateContent(prompt);
                    const result = response.response;
                    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const responseRegex = /^response: (.*)/m;
                        const responseText = text.match(responseRegex)?.[1]?.trim();
                        await msg.edit(responseText);
                    }
                    else {
                        await msg.edit('La IA no pudo identificar un mensaje.');
                    }
                }
                catch (error) {
                    console.error('Error con la IA de Gemini:', error);
                    await msg.edit('Hubo un error al usar la IA de Gemini. ¡Ups!');
                }
            }
            else {
            await message.react('👋');
            await msg.edit('Para no escribir nada, ni me menciones.');
            }
        }
    },
    };