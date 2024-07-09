module.exports = (bot) => {
    // Comando para desbanear usuarios
    bot.command('surjan', async (ctx) => {
        // Verificar que el usuario que envía el comando sea administrador
        const isAdmin = await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
            .then((result) => result.status === 'administrator' || result.status === 'creator')
            .catch(() => false);

        if (!isAdmin) {
            return ctx.reply('Solo los admins pueden usar este comando 🧐');
        }

        // Verificar que se está respondiendo a un mensaje
        if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.from) {
            return ctx.reply('Para desbanear a un usuario, responde al mensaje del usuario que deseas desbanear.');
        }

        // Obtener el ID del usuario a desbanear
        const userId = ctx.message.reply_to_message.from.id;

        try {
            // Desbanear al usuario usando la API de Telegram
            await ctx.telegram.unbanChatMember(ctx.message.chat.id, userId);
            ctx.reply(`El usuario ${ctx.message.reply_to_message.from.first_name} ha sido desbaneado.`);
        } catch (error) {
            console.error('Error al intentar desbanear al usuario:', error);
            ctx.reply('Ocurrió un error al intentar desbanear al usuario.');
        }

        // Eliminar el comando /surjan después de 1 segundo
        deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
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
