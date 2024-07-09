// Función para generar un mensaje de bienvenida aleatorio
function getRandomWelcomeMessage(username) {
    const messages = [
        `¡Hola, ${username}! 🎉 ¡Bienvenid@ al grupo!`,
        `¡Nuevo en el grupo. ${username}! 🌟 ¡Bienvenid@!`,
        `¡${username} se ha unido al grupo! ¡Bienvenid@! 🎊`,
        `¡Bienvenid@, ${username}! Nos alegra tenerte aquí. 🚀`,
        `¡${username} ha llegado! ¡Bienvenid@! 🎈`,
        `¡Hola, ${username}! ¡Bienvenid@ a nuestra comunidad! 🌟`,
        `¡Bienvenid@ al grupo, ${username}! 🎉`,
    ];
    // Escoge un mensaje aleatorio
    return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = (bot) => {
    // Manejar evento de nuevos miembros
    bot.on('new_chat_members', async (ctx) => {
        const newMembers = ctx.message.new_chat_members;
        
        for (let member of newMembers) {
            const username = member.username ? `@${member.username}` : member.first_name;
            const welcomeMessage = getRandomWelcomeMessage(username);
            
            // Enviar mensaje de bienvenida
            await ctx.reply(welcomeMessage);
        }
    });
};
