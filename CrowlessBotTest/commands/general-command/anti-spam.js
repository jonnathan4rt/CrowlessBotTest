module.exports = (bot) => {
    // Middleware para anti-spam de enlaces
    bot.use((ctx, next) => {
        // Verificar si el mensaje contiene un enlace
        if (ctx.message && ctx.message.text && ctx.message.text.match(/\b(?:https?:\/\/|www\.)\S+\b/gi)) {
            // Verificar que el usuario sea administrador
            ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
                .then((chatMember) => {
                    if (chatMember.status !== 'administrator' && chatMember.status !== 'creator') {
                        // Obtener el nombre de usuario o nombre de pila del remitente
                        const senderName = ctx.message.from.username || ctx.message.from.first_name;
                        
                        // Eliminar el mensaje con enlace
                        ctx.deleteMessage(ctx.message.message_id)
                            .then(() => {
                                // Enviar mensaje de advertencia
                                const warningMessage = `@${senderName} Envió un enlace sin permiso 😡`;
                                ctx.reply(warningMessage);
                                console.log(`Mensaje con enlace eliminado: ${ctx.message.text}`);
                            })
                            .catch((error) => {
                                console.error('Error al eliminar el mensaje con enlace:', error);
                            });
                    } else {
                        // Si el usuario es administrador, pasar al siguiente middleware o comando
                        return next();
                    }
                })
                .catch((error) => {
                    console.error('Error al verificar el estado del usuario:', error);
                    // Si hay un error, pasar al siguiente middleware o comando por seguridad
                    return next();
                });
        } else {
            // Si no hay enlace, pasar al siguiente middleware o comando
            return next();
        }
    });
};