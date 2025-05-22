const { VertexAI } = require('@google-cloud/vertexai');
const { SlashCommandBuilder, MessageType } = require('discord.js');
require('dotenv').config();

// CONFIGURAMOS LA CONEXIÓN DE LA IA Y EL MODELO
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'us-central1';
const modelName = 'gemini-2.5-flash-preview-04-17';
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const vertexAI = new VertexAI({
    project: projectId,
    location: location,
    credentials: credentialsPath ? require(credentialsPath) : undefined,
});

// GENERAMOS EL MODELO
const generativeModel = vertexAI.preview.getGenerativeModel({
  model: modelName,
});

// CODIGO DEL COMANDO
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ia')
        .setDescription('Ni yo se lo que hace este comando muchachos...'),
    async execute(interaction) {
        await interaction.deferReply();

        const messages = await interaction.channel.messages.fetch();

        const filteredMessages = messages.filter(m =>
            m.id !== interaction.id &&
            !m.reference &&
            !m.content.includes('http') &&
            m.type !== MessageType.ChatInputCommand &&
            !m.content.startsWith('/'));
        const ordered = [...filteredMessages.values()].reverse();
        const history = ordered.map(m => `${m.author.username}: ${m.content}. Mensaje ID: ${m.id}`).join('\n');
        console.log(history);
        const prompt = `
Antes que nada, necesito que uses la jerga Argentina sin modificar ni nada, solamente que sea el lenguaje Argentino con sus palabras y nada mas.
Te voy a pasar una lista de mensajes donde su formato será | autor: mensaje |, necesito que agarres un mensaje donde te parezca que sea una pregunta o algo por el estilo y le respondas de forma ironica y MUY hirientes, también puedes utilizar insultos. Solamente necesito el mensaje de respuesta y necesitaría que tu respuesta sea enviada en el siguiente formato:
msg_id: {Mensaje ID} (sin las llaves)
response: {Tu respuesta} (sin llaves)
prompt: {autor: mensaje}

${history}
`;
        try {
            const response = await generativeModel.generateContent(prompt);
            const result = response.response;

            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                console.log(text);
                const msgIdRegex = /msg_id: (\d+)/;
                const msgId = text.match(msgIdRegex)?.[1]?.trim();
                const responseRegex = /^response: (.*)/m;
                const responseText = text.match(responseRegex)?.[1]?.trim();

                const targetMessage = await interaction.channel.messages.fetch(msgId);
                await targetMessage.reply(responseText);
                await interaction.editReply(`Mensaje respondido.`);
            }
            else {
                await interaction.editReply('La IA no pudo identificar un mensaje.');
            }
        }
        catch (error) {
            console.error('Error con la IA de Gemini:', error);
            await interaction.editReply('Hubo un error al usar la IA de Gemini. ¡Ups!');
        }
    },
};