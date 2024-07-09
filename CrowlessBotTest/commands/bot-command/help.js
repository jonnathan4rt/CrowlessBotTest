module.exports = (bot) => {
    bot.help((ctx) => {
        const chatId = ctx.chat.id;
        const imageUrl = 'https://drive.google.com/uc?export=download&id=1w8WA2RUSE-S8PAzQUuhXDcm1U1JFWmQ4';

         // Verificar si el mensaje proviene de un chat privado
         if (ctx.chat.type !== 'private') {
            // Si no es un chat privado, ignorar el resto del comando
            return;
        }

        // Enviar la imagen primero
        ctx.replyWithPhoto({ url: imageUrl })
            .then(() => {
                console.log('Imagen de /help enviada correctamente');

                // Después de enviar la imagen, enviar el mensaje con los botones y texto
                const username = ctx.from.first_name;
                const message = `🤖 <b>Usa estos comandos para gestionar:</b>

👮🏻‍♂️ /info - Muestra información de un usuario
🕵🏻‍♂️ /staff - Muestra el Personal del Grupo
🚨 /report - Reporta mensajes inapropiados
🔁 /repeat - Repite mensajes y anuncios
🛑 /stop - Detiene la tarea en repetición
🚫 /ban - Expulsa a un usuario del grupo
🔇 /mute - Permite leer pero no escribir
🔊 /unmute - Permite escribir y leer
⭕️ /surjan - Permite volver a un usuario baneado

<b>Nota:</b> Anti-spam activo permanentemente.`;

                // Enviar mensaje con formato HTML y teclado inline
                ctx.reply(message, {
                    parse_mode: 'HTML', // Indica que el contenido es HTML
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '➕ Agrégame a un grupo ➕', url: 'https://t.me/CrowlessBot?startgroup=true' }]
                        ]
                    }
                });
            })
            .catch((error) => console.error('Error al enviar la imagen:', error));
    });
};
