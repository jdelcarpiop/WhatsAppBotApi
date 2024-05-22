const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, Poll, MessageMedia } = require('whatsapp-web.js');

const wwebVersion = '2.2407.3';
const client_ventas = new Client({
    authStrategy: new LocalAuth({ clientId: "Ventas" }),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
    loadAllUnreadMessages: false,
    linkPreview: true
});

client_ventas.initialize();

client_ventas.on('qr', qr => {
    console.log('QR WhatsApp Ventas');
    qrcode.generate(qr, { small: true });
});

client_ventas.on('ready', () => {
    console.log('WhatsApp Ventas Conectado');
    client_estudiantes.initialize();
});

const client_estudiantes = new Client({
    authStrategy: new LocalAuth({ clientId: "Ventas" }),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
    loadAllUnreadMessages: false,
    linkPreview: true
});



client_estudiantes.on('qr', qr => {
    console.log('QR WhatsApp Ventas');
    qrcode.generate(qr, { small: true });
});

client_estudiantes.on('ready', () => {
    console.log('WhatsApp Ventas Conectado');
    client_makanudo.initialize();
});

const client_makanudo = new Client({
    authStrategy: new LocalAuth({ clientId: "Ventas" }),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
    loadAllUnreadMessages: false,
    linkPreview: true
});



client_makanudo.on('qr', qr => {
    console.log('QR WhatsApp Ventas');
    qrcode.generate(qr, { small: true });
});

client_makanudo.on('ready', () => {
    console.log('WhatsApp Ventas Conectado');
});