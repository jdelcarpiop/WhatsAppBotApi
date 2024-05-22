const convertmessage = require('./convertmessage.js');
const countryData = require('./countrydata.js');
const moment = require('moment-timezone');

//let message = await convertmessage(phone, response.message_foreign);



for (let countryCode in countryData) {
    if (countryData.hasOwnProperty(countryCode)) {
        // Acceder al objeto de cada país
        let country = countryData[countryCode];
        // Mostrar el timezone del país actual
        //console.log(`El timezone de ${country.country} (${countryCode}) es ${country.timezone}`);

        const peruMoment = moment.tz('20:00', 'hh:mm A', 'America/Lima');
        const localMoment = peruMoment.clone().tz(country.timezone);

        console.log(`${localMoment.format('hh:mm A')} *(Hora ${country.country})*`);
    }
}