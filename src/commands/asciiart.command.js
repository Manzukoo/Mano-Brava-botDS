const { SlashCommandBuilder } = require('discord.js');
const { Jimp } = require('jimp');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('asciiart')
        .setDescription('Mandame la imagen que quieras que te la convierto en ASCII, genio.')
        .addAttachmentOption(option =>
            option.setName('imagen')
                .setDescription('La imagen a convertir')
                .setRequired(true)),
    async execute(e) {
        const imgUrl = e.options.getAttachment('imagen').url;

        if (!imgUrl) {
            return e.reply({ content: 'Por favor, adjunta una imagen usando las opciones del comando.', ephemeral: true });
        }

        try {
            const imgProcess = await Jimp.read(imgUrl);
            const width = imgProcess.width;
            const height = imgProcess.height;
            const aspectRatio = height / width;
            const newWidth = 60;
            const newHeight = Math.floor(newWidth * aspectRatio * 0.5);
            imgProcess.resize({ w: newWidth, h: newHeight, mode: Jimp.RESIZE_BILINEAR });
            imgProcess.greyscale();

            const pixelData = [];
            imgProcess.scan(0, 0, imgProcess.bitmap.width, imgProcess.bitmap.height, (x, y, idx) => {
                const red = imgProcess.bitmap.data[idx + 0];
                pixelData.push(red);
            });

            const asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!;:,\"^'. ";
            const numChars = asciiChars.length;
            let asciiArt = '';

            for (let i = 0; i < pixelData.length; i++) {
                const intensity = pixelData[i];
                const charIndex = Math.floor(intensity * numChars / 256);
                asciiArt += asciiChars[charIndex];
                if ((i + 1) % newWidth === 0) {
                    asciiArt += '\n';
                }
            }

            const formattedAscii = `\`\`\`\n${asciiArt}\n\`\`\``;
            if (formattedAscii.length > 2000) {
                return e.reply({ content: 'El resultado ASCII es demasiado largo para mostrar en un solo mensaje.' });
            }
            console.log(formattedAscii);
            return e.reply({ content: formattedAscii });

        }
        catch (error) {
            console.error('Error al procesar la imagen:', error);
            return e.reply({ content: 'Hubo un error al procesar la imagen. Asegúrate de que la URL sea válida y la imagen esté accesible.' });
        }
    },
};