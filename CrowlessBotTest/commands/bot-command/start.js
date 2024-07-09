// commands/start.js
module.exports = (bot) => {
    bot.start((ctx) => {
        const chatId = ctx.chat.id;

        // Verificar si el mensaje proviene de un chat privado
        if (ctx.chat.type !== 'private') {
            // Si no es un chat privado, ignorar el comando
            return;
        }

        const username = ctx.from.first_name;
        const message = `👋¡Hola  <b>${username}</b>!\n\n🤖 Crowless es el bot más cool para administrar y mantener tus grupos con estilo y eficiencia.\n\n👉🏻 Añádeme a un grupo y nómbrame como Administrador para ponerme en acción!\n\n❓ ¿CUÁLES SON LOS COMANDOS? ❓\nPulsa /help para ver todos los comandos y sus funcionamientos!`;
        
        // Enviar mensaje con formato HTML y teclado inline
        ctx.reply(message, {
            parse_mode: 'HTML', // Indica que el contenido es HTML
            reply_markup: {
                inline_keyboard: [
                    [{ text: '➕ Agrégame a un grupo ➕', url: 'https://t.me/CrowlessBot?startgroup=true' }]
                ]
            }
        });
    });
};
