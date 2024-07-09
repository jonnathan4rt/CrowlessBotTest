const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.command(['mute'], async (ctx) => {
        // Verificar que el usuario que envía el comando sea administrador
        const isAdmin = ctx.message.from && ctx.message.chat && await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
            .then((result) => result.status === 'administrator' || result.status === 'creator')
            .catch(() => false);

        if (!isAdmin) {
            // Eliminar el comando /mute después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
            return ctx.reply('Solo los admins pueden usar este comando 🧐');
        }

        // Verificar que se está respondiendo a un mensaje
        if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.from) {
            // Eliminar el comando /mute después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
            return ctx.reply('Responde al mensaje del usuario que deseas mutear.');
        }

        // Obtener información del usuario que se quiere mutear
        const userId = ctx.message.reply_to_message.from.id;

        try {
            // Obtener el nombre de pila del usuario
            const user = await ctx.telegram.getChatMember(ctx.message.chat.id, userId);
            const firstName = `<b>${user.user.first_name}</b>`; // Nombre de usuario en negritas

            // Mutear al usuario usando la API de Telegram (permiso hasta la fecha máxima posible)
            await ctx.telegram.restrictChatMember(ctx.message.chat.id, userId, {
                permissions: {
                    can_send_messages: false,
                    can_send_media_messages: false,
                    can_send_polls: false,
                    can_send_other_messages: false,
                    can_add_web_page_previews: false,
                    can_change_info: false,
                    can_invite_users: false,
                    can_pin_messages: false,
                }
            });

            // Enviar mensaje con formato HTML, con el nombre de usuario en negritas
            ctx.reply(`${firstName} ha sido muteado 🤫`, { parse_mode: 'HTML' });

            // Eliminar el comando /mute después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);

        } catch (error) {
            console.error('Error al intentar mutear al usuario:', error);
            ctx.reply('Ocurrió un error al intentar mutear al usuario.');
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
