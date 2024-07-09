const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.command(['unmute'], async (ctx) => {
        // Verificar que el usuario que envía el comando sea administrador
        const isAdmin = ctx.message.from && ctx.message.chat && await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
            .then((result) => result.status === 'administrator' || result.status === 'creator')
            .catch(() => false);

        if (!isAdmin) {
            return ctx.reply('Solo los admins pueden usar este comando 🧐');
        }

        // Verificar que se está respondiendo a un mensaje
        if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.from) {
            return ctx.reply('Responde al mensaje del usuario que deseas desmutear.');
        }

        // Obtener información del usuario que se quiere desmutear
        const userId = ctx.message.reply_to_message.from.id;

        try {
            // Obtener el nombre de pila del usuario
            const user = await ctx.telegram.getChatMember(ctx.message.chat.id, userId);
            const firstName = `<b>${user.user.first_name}</b>`; // Nombre de usuario en negritas

            // Restaurar permisos al usuario usando la API de Telegram
            await ctx.telegram.restrictChatMember(ctx.message.chat.id, userId, {
                permissions: {
                    can_send_messages: true,
                    can_send_media_messages: true,
                    can_send_polls: true,
                    can_send_other_messages: true,
                    can_add_web_page_previews: true,
                    can_change_info: true,
                    can_invite_users: true,
                    can_pin_messages: true,
                }
            });

            // Enviar mensaje con formato HTML, con el nombre de usuario en negritas
            ctx.reply(`${firstName} ha sido desmuteado 😊`, { parse_mode: 'HTML' });
        } catch (error) {
            console.error('Error al intentar desmutear al usuario:', error);
            ctx.reply('Ocurrió un error al intentar desmutear al usuario.');
        }

        // Eliminar el comando /unmute después de 1 segundo
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
