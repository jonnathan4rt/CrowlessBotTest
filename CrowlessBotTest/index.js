const { Telegraf } = require('telegraf');
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
const http = require('http');

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

// Iniciar el bot de Telegram
bot.launch().then(() => {
  console.log('Bot iniciado correctamente.');
}).catch((err) => {
  console.error('Error al iniciar el bot:', err);
});

// Configuración del servidor ficticio para Render
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot en funcionamiento\n');
});

server.listen(port, () => {
  console.log(`Servidor ficticio escuchando en el puerto ${port}`);
});
