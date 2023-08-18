const moment = require('moment-timezone');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Definición de los códigos de país y zonas horarias
const countryData = require('./countrydata.js');

function getCountryAndLocalTime(whatsAppNumber, peruTime) {
    let parsedPhoneNumber = parsePhoneNumberFromString(extractNumber(whatsAppNumber));
    const data = countryData[parsedPhoneNumber.country];

    if (!data) {
        return `${peruTime} *(Hora Perú)*`;
    }
    const peruMoment = moment.tz(peruTime, 'hh:mm A', 'America/Lima');
    const localMoment = peruMoment.clone().tz(data.timezone);

    return `${localMoment.format('hh:mm A')} *(Hora ${data.country})*`;
}

function extractNumber(string) {
    const match = string.match(/(\d+)@/);
    if (match) {
        return "+" + match[1];
    } else {
        throw new Error('El string no contiene un número seguido por un @');
    }
}

//Reemplaza el tiempo con este formato {{08:00 PM}}

function replacetime(phone, text) {
    const regex = /{{(.*?)}}/g;
    return text.replace(regex, (match, p1) => getCountryAndLocalTime(phone, p1.trim()));
}

module.exports = replacetime;
