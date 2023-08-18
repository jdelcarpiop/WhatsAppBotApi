const replacetime = require('./times.js');
const replacecurrency = require('./currencies.js');

async function convertmessage(phone, text) {
    try {
        const time_message = replacetime(phone, text);
        const currency_message = await replacecurrency(phone, time_message);
        return currency_message;
    } catch (error) {
        console.error('Hubo un error:', error);
    }
}

module.exports = convertmessage;