const { Telegraf, Markup } = require('telegraf');
const banCommand = require('./commands/admin-command/ban');
const infoCommand = require('./commands/users-command/info');
const helpCommand = require('./commands/bot-command/help');
const startCommand = require('./commands/bot-command/start');
const staffCommand = require('./commands/users-command/staff');
const repeatCommand = require('./commands/admin-command/repeat');
const reportCommand = require('./commands/users-command/report');
const surjanCommand = require('./commands/admin-command/surjan');
const antiSpamCommand = require('./commands/general-command/anti-spam');
const muteCommand = require('./commands/admin-command/mute');
const unmuteCommand = require('./commands/admin-command/unmute');
const helloCommand = require('./commands/general-command/hello');
const express = require('express');

const token = '7301985658:AAEsz-N9Buoau-LnY-h9mV0M94OF7MwpBpw';
const bot = new Telegraf(token);

// General Command
antiSpamCommand(bot);
helloCommand(bot);

// Bot Command
startCommand(bot);
helpCommand(bot);

// Users Command
infoCommand(bot);
staffCommand(bot);
reportCommand(bot);

// ADMIN Command
banCommand(bot);
repeatCommand(bot);
surjanCommand(bot);
muteCommand(bot);
unmuteCommand(bot);

// Configuración del servidor Express para Render
const app = express();
const port = process.env.PORT || 3000;

// Ruta básica que responde con "Hola Mundo!"
app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

// Iniciar el bot de Telegram
bot.launch().then(() => {
  console.log('Bot iniciado correctamente.');
}).catch((err) => {
  console.error('Error al iniciar el bot:', err);
});

// Iniciar el servidor Express en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
