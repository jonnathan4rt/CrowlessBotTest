module.exports = (bot) => {
    bot.command('staff', async (ctx) => {
        const chatId = ctx.chat.id;

        try {
            // Obtener la lista de administradores del chat
            const admins = await ctx.getChatAdministrators(chatId);
            if (admins.length === 0) {
                ctx.reply("No se encontraron administradores en este grupo.");
                // Eliminar el comando /staff después de 1 segundo
                deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
                return;
            }

            // Filtrar para incluir solo administradores humanos
            const humanAdmins = admins.filter(admin => !admin.user.is_bot);

            if (humanAdmins.length === 0) {
                ctx.reply("No se encontraron administradores humanos en este grupo.");
                // Eliminar el comando /staff después de 1 segundo
                deleteMessageAfterDelay(ctx, ctx.message.message_id, 1000);
                return;
            }

            // Crear un mensaje con los nombres de los administradores humanos
            let staffList = "👥 <b>Nuestro Equipo Administrativo:</b>\n\n";
            humanAdmins.forEach(admin => {
                const user = admin.user;
                const userName = user.username ? '@' + user.username : '';
                staffList += `- <b>${user.first_name || ''} ${user.last_name || ''}</b> ${userName}\n`;
            });

            ctx.replyWithHTML(staffList);
        } catch (error) {
            console.error("Error al obtener administradores:", error);
            ctx.reply("Hubo un error al obtener la lista de personal. Inténtalo de nuevo más tarde.");
        }

        // Eliminar el comando /staff después de 1 segundo
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
