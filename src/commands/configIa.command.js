const { SlashCommandBuilder } = require('discord.js');
const initGenerativeModel = require('../helpers/iaInit.helper');
const ia = initGenerativeModel();

module.exports = {
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('iaconfig')
        .setDescription('Configurando la actitud de la IA.')
        .addStringOption(option =>
		option.setName('actitud')
			.setDescription('Configura la actitud de la IA, campeón')
			.setRequired(true)
			.addChoices(
				{ name: 'Re copado', value: 'ia_buena' },
				{ name: 'Dejalo tranquilo al pibe', value: 'ia_intermedia' },
				{ name: 'Hijo de puta', value: 'ia_mala' },
			)),
    async execute(e) {
        await e.deferReply();

		const actitud = e.options.getString('actitud');
        const { actitudIa } = e.client;
        actitudIa.set(e.guild.id, actitud);

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
        const prompt = `
        Antes que nada, necesito que uses la jerga Argentina sin modificar ni nada, solamente que sea el lenguaje Argentino con sus palabras y nada mas.
        Se modificó tu actitud, el usuario que lo hizo fue ${e.user.username}. Ahora ${mensaje}.
        Por favor responde al usuario que te modificó tu actitud según el rol que adaptes.`;

        try {
            const response = await ia.generateContent(prompt);
            const result = response.response;

            const respuesta = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (respuesta) await e.editReply(respuesta);
            else await e.editReply('La IA no pudo responder.');
        }
        catch (error) {
            console.error('Error con la IA de Gemini:', error);
            await e.editReply('Hubo un error al usar la IA de Gemini. ¡Ups!');
        }
    },
};