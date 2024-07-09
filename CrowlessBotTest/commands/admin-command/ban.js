// Función para generar un mensaje de baneo aleatorio
function getRandomBanMessage(username) {
    const messages = [
        `Incluso la paciencia de Buda tiene un límite. ${username} fue destruido. 😠`,
        `Incluso un dios puede perder la paciencia. ${username} fue enviado al abismo. 🕳`,
        `Hasta los dioses imponen límites. ${username} fue destruido. 🔥`,
        `La paciencia divina tiene un fin. ${username} fue enviado al abismo. 🕳`,
        `¡${username} ha sido baneado! 🚫 No más travesuras por aquí.`,
        `¡${username} ha sido expulsado! ⛔️ Adiós, adiós.`,
    ];
    // Escoge un mensaje aleatorio
    return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = (bot) => {
    bot.command(['ban', 'hakai'], async (ctx) => {
        // Verificar que el usuario que envía el comando sea administrador
        const isAdmin = ctx.message.from && ctx.message.chat && await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
            .then((result) => result.status === 'administrator' || result.status === 'creator')
            .catch(() => false);

        if (!isAdmin) {
            // Eliminar el comando /ban después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
            return ctx.reply('Solo los admins pueden usar este comando 🧐');
        }

        // Verificar que se está respondiendo a un mensaje
        if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.from) {
            // Eliminar el comando /ban después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
            return ctx.reply('Responde al mensaje del usuario que deseas banear.');
        }

        // Obtener información del usuario que se quiere banear
        const userId = ctx.message.reply_to_message.from.id;

        try {
            // Obtener el nombre de pila del usuario
            const user = await ctx.telegram.getChatMember(ctx.message.chat.id, userId);
            const firstName = `<b>${user.user.first_name}</b>`; // Nombre de usuario en negritas

            // Prohibir al usuario usando la API de Telegram
            await ctx.telegram.banChatMember(ctx.message.chat.id, userId);

            // Obtener un mensaje de baneo aleatorio
            const banMessage = getRandomBanMessage(`@${user.user.username}`);

            // Enviar mensaje de baneo con formato HTML
            ctx.reply(banMessage, { parse_mode: 'HTML' });

            // Eliminar el comando /ban después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
        } catch (error) {
            console.error('Error al intentar banear al usuario:', error);
            ctx.reply('Ocurrió un error al intentar banear al usuario.');
        }
    });
};

/**
 * Eliminar un mensaje después de un retraso especificado.
 * 
 * @param {Object} ctx - El contexto del bot de Telegraf.
 * @param {number} messageId - El ID del mensaje a eliminar.
 * @param {number} delay - El retraso en milisegundos antes de eliminar el mensaje.
 */
function deleteMessageAfterDelay(ctx, messageId, delay) {
    setTimeout(() => {
        ctx.deleteMessage(messageId).catch((err) => {
            console.error('Error al intentar eliminar el mensaje:', err);
        });
    }, delay);
}
