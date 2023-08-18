const countryData = require('./countrydata.js');

const axios = require('axios');
const libphonenumber = require('libphonenumber-js');
const api_key = 'e070ec8e7c9e5ac9ab24e0c9';

async function convertCurrencyByPhoneNumber(whatsAppNumber, usdAmount) {
    let parsedPhoneNumber = libphonenumber.parsePhoneNumber(extractNumber(whatsAppNumber));
    
    //let response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    let response = await axios.get(`https://v6.exchangerate-api.com/v6/${api_key}/latest/USD`);
    //console.log(response);
    let exchangeRates = response.data.conversion_rates;
    let countryInfo = countryData[parsedPhoneNumber.country];

    if (!countryInfo) {
        return '';
    }
    if(countryInfo.currencyCode == 'USD') {
        return '';
    }

    if (countryInfo) {
        let currencyCode = countryInfo.currencyCode;
        let currencySymbol = countryInfo.currencySymbol;
        let exchangeRate = exchangeRates[currencyCode];
        if (exchangeRate) {
            let localAmount = usdAmount * exchangeRate;
            let formattedAmount = localAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            return `*${countryInfo.country}:* ${currencySymbol} ${formattedAmount} *${countryInfo.currencyName}*`;
        } else {
            //throw new Error('No se pudo encontrar la tasa de cambio para ' + currencyCode);
            return '';
        }
    } 
}

function extractNumber(string) {
    const match = string.match(/(\d+)@/);
    if (match) {
        return "+" + match[1];
    } else {
        throw new Error('El string no contiene un número seguido por un @');
    }
}

async function replacecurrency(phone, text) {
    const regex = /\[\[(.*?)\]\]/g;
    const promises = [];
    let matches = [];

    // Encuentra todos los valores a reemplazar y crea promesas para ellos
    text.replace(regex, (match, p1) => {
        const promise = convertCurrencyByPhoneNumber(phone, p1.trim());
        promises.push(promise);
        matches.push(match); // Almacenar los valores originales para poder reemplazarlos más tarde
    });

    const results = await Promise.all(promises);

    // Reemplaza cada valor original con su resultado correspondiente
    matches.forEach((match, i) => {
        text = text.replace(match, results[i]);
    });

    return text;
}

module.exports = replacecurrency;
