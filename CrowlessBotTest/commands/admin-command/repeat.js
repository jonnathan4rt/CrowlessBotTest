const { Markup } = require('telegraf');

// Mapa para almacenar las tareas programadas por chat ID
const scheduledTasks = new Map();

module.exports = function(bot) {
    let repliedMessage = null; // Variable global para el mensaje a repetir
    let photoMessageId = null; // Variable global para el ID del mensaje de la foto
    let intervalMessageId = null; // Variable global para el ID del mensaje de intervalos

    // Comando /repeat para seleccionar mensaje a repetir
    bot.command('repeat', async (ctx) => {
        console.log('Comando /repeat ejecutado'); // Log

        // Verificar que el usuario que envía el comando sea administrador
        const isAdmin = await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
            .then((result) => result.status === 'administrator' || result.status === 'creator')
            .catch(() => false);

        if (!isAdmin) {
            return ctx.reply('Solo los admins pueden usar este comando 🧐');
        }

        repliedMessage = ctx.message.reply_to_message;

        if (!repliedMessage) {
            ctx.reply('❌ Responde a un mensaje con /repeat para seleccionarlo.');
            return;
        }

        const chatId = ctx.chat.id;

        // URL de la imagen que quieres enviar para el menú de botones (opcional)
        const imageUrl = 'https://drive.google.com/uc?export=view&id=1184NTlo_akprkpePAo-iwEEAJY1Rw8Bv';

        // Enviar la imagen del menú de botones primero y guardar el ID del mensaje
        ctx.replyWithPhoto({ url: imageUrl, caption: 'Selecciona un intervalo de repetición:' })
            .then((message) => {
                photoMessageId = message.message_id;
                console.log(`Mensaje de la foto enviado con ID: ${photoMessageId}`); // Log

                // Opciones de intervalo de repetición
                const repeatOptions = [
                    { text: '⏳ 10 minutos', interval: 600000 },
                    { text: '🕒 30 minutos', interval: 1800000 },
                    { text: '⏰ 2 horas', interval: 7200000 },
                    { text: '🕕 6 horas', interval: 21600000 },
                    { text: '🕗 8 horas', interval: 28800000 },
                    { text: '🕛 16 horas', interval: 57600000 }
                ];

                // Crear teclado inline con las opciones divididas en dos filas
                const keyboard = Markup.inlineKeyboard([
                    repeatOptions.slice(0, 3).map(option => Markup.button.callback(option.text, option.interval.toString())),
                    repeatOptions.slice(3, 6).map(option => Markup.button.callback(option.text, option.interval.toString()))
                ]);

                // Enviar los botones inline y guardar el ID del mensaje
                ctx.reply('Selecciona un intervalo de repetición:', keyboard)
                    .then((message) => {
                        intervalMessageId = message.message_id;
                        console.log(`Mensaje de intervalos enviado con ID: ${intervalMessageId}`); // Log

                        // Eliminar el mensaje del comando /repeat después de 1 segundo
                        setTimeout(() => {
                            deleteMessageAfterDelay(ctx, ctx.message.message_id, '/repeat', 0);
                        }, 1000);
                    });
            })
            .catch((error) => {
                console.error('❌ Ocurrió un error al mostrar los botones:', error);
                ctx.reply('❌ Ocurrió un error al mostrar los botones. Intenta de nuevo más tarde.');
            });
    });

    // Manejar la respuesta del usuario al teclado inline
    bot.action(/\d+/, (ctx) => {
        console.log('Opción de intervalo seleccionada'); // Log

        const chatId = ctx.chat.id;
        const interval = parseInt(ctx.match[0]);
        console.log(`Intervalo seleccionado: ${interval}`); // Log

        // Detener todas las tareas activas para este chat antes de iniciar una nueva
        stopAllScheduledTasks(chatId);

        // Guardar el mensaje para la tarea
        const messageToRepeat = repliedMessage;

        // Función para enviar el mensaje o contenido repetido
        const repeatMessage = () => {
            console.log('Repetir mensaje ejecutado'); // Log

            if (messageToRepeat) {
                if (messageToRepeat.text) {
                    ctx.telegram.sendMessage(chatId, messageToRepeat.text);
                } else if (messageToRepeat.photo) {
                    const photoId = messageToRepeat.photo[0].file_id;
                    const caption = messageToRepeat.caption || '';
                    ctx.telegram.sendPhoto(chatId, photoId, { caption });
                } else if (messageToRepeat.video) {
                    const videoId = messageToRepeat.video.file_id;
                    const caption = messageToRepeat.caption || '';
                    ctx.telegram.sendVideo(chatId, videoId, { caption });
                } else if (messageToRepeat.animation) {
                    const animationId = messageToRepeat.animation.file_id;
                    const caption = messageToRepeat.caption || '';
                    ctx.telegram.sendAnimation(chatId, animationId, { caption });
                } else {
                    ctx.reply('❌ El tipo de mensaje no es compatible para repetir.');
                }
            } else {
                ctx.reply('❌ No hay mensaje seleccionado para repetir.');
            }
        };

        // Crear una nueva tarea y programarla después de la selección del intervalo
        const task = () => {
            repeatMessage();
        };

        const scheduledTask = setInterval(task, interval);
        scheduledTasks.set(chatId, scheduledTask);
        console.log(`Tarea programada con intervalo de ${interval / 1000} segundos`); // Log

        // Convertir el intervalo a minutos u horas para el mensaje de confirmación
        let intervalMessage;
        if (interval >= 3600000) {
            intervalMessage = `${interval / 3600000} horas`;
        } else {
            intervalMessage = `${interval / 60000} minutos`;
        }

        ctx.reply(`🔁 El mensaje se mostrará cada ${intervalMessage}. Usa /stop para detener.`);

        // Eliminar la foto, el mensaje de selección de intervalos y el menú de opciones
        deleteMessageAfterDelay(ctx, photoMessageId, 'Menú de botones de intervalos', 0);
        deleteMessageAfterDelay(ctx, intervalMessageId, 'Respuesta del teclado inline', 0);
    });

    // Manejar el comando /stop para detener las repeticiones
    bot.command('stop', async (ctx) => {
        console.log('Comando /stop ejecutado'); // Log

        const chatId = ctx.chat.id;

        // Verificar que el usuario que envía el comando sea administrador
        const isAdmin = await ctx.telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id)
            .then((result) => result.status === 'administrator' || result.status === 'creator')
            .catch(() => false);

        if (!isAdmin) {
            ctx.reply('Solo los admins pueden usar este comando 🧐');

            // Eliminar el mensaje del comando /stop inmediatamente
            deleteMessageAfterDelay(ctx, ctx.message.message_id, '/stop', 0);
            return;
        }

        // Detener la tarea programada si existe
        stopAllScheduledTasks(chatId);
        ctx.reply('⛔ Tarea detenida.');

        // Eliminar el mensaje del comando /stop después de 1 segundo
        setTimeout(() => {
            deleteMessageAfterDelay(ctx, ctx.message.message_id, '/stop', 0);
        }, 1000);
    });
};

// Función para detener todas las tareas programadas para un chat específico
function stopAllScheduledTasks(chatId) {
    const scheduledTask = scheduledTasks.get(chatId);
    if (scheduledTask) {
        clearInterval(scheduledTask);
        scheduledTasks.delete(chatId);
        console.log(`Tareas detenidas para el chat ID: ${chatId}`); // Log
    }
}

// Función para eliminar un mensaje después de un retraso especificado
function deleteMessageAfterDelay(ctx, messageId, messageText, delay) {
    setTimeout(() => {
        ctx.telegram.deleteMessage(ctx.chat.id, messageId)
            .then(() => {
                console.log(`Mensaje eliminado correctamente: "${messageText}" (ID: ${messageId})`); // Log
            })
            .catch((err) => {
                console.error(`Error al intentar eliminar el mensaje: "${messageText}" (ID: ${messageId})`, err);
            });
    }, delay);
}
