const { Client, LocalAuth } = require('whatsapp-web.js');

// Create a new client instance (with args to enhance Puppeteer)
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sessionInfo'
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    }
});




// Start your client
client.initialize();

//Track progress
client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});



// When the client is almost ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is almost ready.');
});

// Pairing code only needs to be requested once
let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);

    // pairing code example
    const pairingCodeEnabled = true;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode('2349049429208'); // enter the target phone number
        console.log('Pairing code enabled, code: '+ pairingCode);
        pairingCodeRequested = true;
    }
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('READY');
    const debugWWebVersion = await client.getWWebVersion();
    console.log(`WWebVersion = ${debugWWebVersion}`);

    client.pupPage.on('pageerror', function(err) {
        console.log('Page error: ' + err.toString());
    });
    client.pupPage.on('error', function(err) {
        console.log('Page error: ' + err.toString());
    });
    
});

//Notify that session ID has been saved
client.on('remote_session_saved', () => {
    console.log('Session ID saved.\nClient is good to go!')
});




//Creating a basic PING command
client.on('message_create', message => {
	if (message.body === '.ping') {
		// reply back "Pong..." directly to the message
		message.reply('Pong...');
	}
});



