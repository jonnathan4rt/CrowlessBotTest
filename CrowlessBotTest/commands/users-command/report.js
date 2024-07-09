const { Markup } = require('telegraf');

module.exports = (bot) => {
    // Comando para reportar mensajes
    bot.command('report', async (ctx) => {
        // Verificar si se está respondiendo a un mensaje
        if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.from) {
            // Eliminar el comando /report después de 1 segundo
            deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
            return ctx.reply('Para reportar un mensaje, responde al mensaje que deseas reportar.');
        }

        // Obtener información del mensaje reportado y del usuario que reporta
        const reportedMessage = ctx.message.reply_to_message;
        const reporter = ctx.from;

        // Crear el enlace directo al mensaje reportado
        const messageLink = `https://t.me/${ctx.chat.username}/${reportedMessage.message_id}`;

        // Construir el mensaje completo con el aviso de reporte, nombre del reportante y el mensaje reportado
        const htmlMessage = `⚠️ <b>Reporte de Mensaje</b> ⚠️\n\nEl usuario ${reporter.first_name} ha reportado un mensaje:\n\n💬 ${reportedMessage.text || reportedMessage.caption || ''}`;

        // Notificar a los administradores del grupo o canal
        const admins = await ctx.getChatAdministrators(ctx.message.chat.id);
        const adminIds = admins.map(admin => admin.user.id);

        for (const adminId of adminIds) {
            try {
                const admin = await ctx.telegram.getChatMember(ctx.message.chat.id, adminId);

                // Verificar si el administrador es un bot
                if (admin.user.is_bot) {
                    continue; // Omitir el envío al administrador que es un bot
                }

                // Enviar notificación al administrador con el mensaje reportado y el enlace
                await ctx.telegram.sendMessage(adminId, htmlMessage, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Ver Mensaje', url: messageLink }]
                        ]
                    }
                });
            } catch (error) {
                console.error('Error al notificar al administrador:', error);
            }
        }

        // Confirmar al usuario que su reporte ha sido enviado
        ctx.reply('Tu reporte será revisado 🫡🔎');

        // Eliminar el comando /report después de 1 segundo
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
