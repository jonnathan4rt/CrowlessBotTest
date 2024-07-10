const { Telegraf } = require('telegraf');
const express = require('express');

// Importar comandos
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

// Inicializar el bot con el token
const token = '7301985658:AAEsz-N9Buoau-LnY-h9mV0M94OF7MwpBpw';
const bot = new Telegraf(token);

// Registrar comandos del bot
banCommand(bot);
infoCommand(bot);
helpCommand(bot);
startCommand(bot);
staffCommand(bot);
repeatCommand(bot);
reportCommand(bot);
surjanCommand(bot);
antiSpamCommand(bot);
muteCommand(bot);
unmuteCommand(bot);
helloCommand(bot);

// Iniciar el bot de Telegram
bot.launch().then(() => {
  console.log('Bot iniciado correctamente.');
}).catch((err) => {
  console.error('Error al iniciar el bot:', err);
});

// Configuración del servidor Express para Render
const app = express();
const port = process.env.PORT || 3000;

// Ruta básica que responde con "Bot en funcionamiento"
app.get('/', (req, res) => {
  res.send('Bot en funcionamiento');
});

// Iniciar el servidor Express en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
