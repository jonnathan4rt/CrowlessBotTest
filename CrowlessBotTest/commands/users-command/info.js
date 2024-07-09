module.exports = (bot) => {
    bot.command('info', async (ctx) => {
        const chatId = ctx.chat.id;
        let userId;

        // Verificar si hay un usuario marcado como respuesta
        if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
            userId = ctx.message.reply_to_message.from.id;
        } else {
            userId = ctx.from.id;
        }

        try {
            // Obtener información detallada del usuario
            const user = await ctx.telegram.getChatMember(chatId, userId);
            const userType = user.user.is_bot ? 'Bot' : 'Humano'; // Determinar tipo de usuario
            const userStatus = user.status === 'administrator' || user.status === 'creator' ? 'Administrador' : 'Miembro'; // Estado del usuario

            // Construir el mensaje de información
            const userInfo = `
👤 <b>Información del Usuario:</b>

🦸 Raza: ${userType}
📝 Nombre: ${user.user.first_name} ${user.user.last_name || ''}
👥 Usuario: @${user.user.username || 'No tiene'}
🆔 ID: ${userId}
⚙️ Estado: ${userStatus}
`;

            // Enviar información con formato HTML
            ctx.replyWithHTML(userInfo);
        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
            ctx.reply("No se pudo obtener la información del usuario. Inténtalo de nuevo más tarde.");
        }

        // Eliminar el comando /info después de 1 segundo
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
