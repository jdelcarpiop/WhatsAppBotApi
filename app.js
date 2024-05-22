/* API */

const express = require('express');

const app = express();

app.use(express.json());

/* Status Api */
app.get('/testApi', async (req, res) => {
    res.send('Api Pasión por la Educación. Status: Enable');
});

const password = '39d5a072e22cf42412dcaea29218fb2e'

/* Send Msg User*/
app.post('/send', async (req, res) => {
    let status = '';
    try {
        
        let pass = req.body.pass;
        if (password == pass) {
            const exist = await client.isRegisteredUser(req.body.phone);

            if (exist) {
                let chatId = req.body.phone + "@c.us";
                let linkPreview = (req.body.linkPreview == "1" ? true : false);

                if (req.body.msg != "") {

                    let message = await convertmessage(chatId, req.body.msg);

                    await client.sendMessage(chatId, message, { linkPreview: linkPreview })
                        .then(response => {
                            status = 'send-success-msg';
                        }).catch(error => {
                            status = 'send-error-msg';
                        });
                }
                if (req.body.UrlMedia != "") {
                    const media = MessageMedia.fromFilePath(req.body.UrlMedia);
                    let caption = req.body.caption;
                    await client.sendMessage(chatId, media, { caption: caption })
                        .then(response => {
                            status = 'send-success-img';
                        }).catch(error => {
                            status = 'send-error-img';
                        });
                }

            } else {
                status = `verified-failed: ${req.body.phone}`;
            }
        } else {
            status = 'auth-failed';
        }
        console.log(status);
        res.send(status);
    } catch (error) {
        console.error('Error', error);
        status = 'send-error-try';
        res.send(status);
    }
});

/* Send Msg Group*/
app.post('/sendgroup', async (req, res) => {
    let status = '';
    try {
        
        let pass = req.body.pass;
        if (password == pass) {
            let GroupId = req.body.GroupId;
            let linkPreview = (req.body.linkPreview == "1" ? true : false);
            let chkmentions = (req.body.mentions == "1" ? true : false);
            //chkmentions = false;
            if (req.body.UrlMedia != "") {
                //console.log(req.body.UrlMedia);
                const media = MessageMedia.fromFilePath(req.body.UrlMedia);
                //console.log(media);
                let caption = req.body.caption;
                await client.sendMessage(GroupId, media, { caption: caption })
                    .then(response => {
                        status = 'send-success-img';
                    }).catch(error => {
                        status = 'send-error-img';
                    });
            }
            if (req.body.msg != "") {
                let mentions = [];
                if (chkmentions) {
                    const group = await client.getChatById(GroupId);

                    for (let participant of group.participants) {
                        //const contact = await client.getContactById(participant.id._serialized);
                        //mentions.push(contact);
                        mentions.push(participant.id._serialized);
                    }
                }
                await client.sendMessage(GroupId, req.body.msg, { mentions: mentions, linkPreview: linkPreview })
                    .then(response => {
                        status = 'send-success';

                    })
                    .catch(error => {
                        status = 'send-error';
                    });
            }
            if (req.body.pollQuestion != "" && req.body.pollOptions != "") {
                let question = req.body.pollQuestion;
                let chkmulti = (req.body.pollMulti == "1" ? true : false);
                let options = req.body.pollOptions.split("&");
                let secret = req.body.pollSecret;


                const numbers = secret.split(',').map(Number);

                // Create the final array with the desired length and fill it with the numbers
                const finalArray = Array(32).fill(0);
                numbers.forEach((num, index) => {
                    finalArray[index] = num;
                });

                //console.log(secret, finalArray);
                /* client.sendMessage('120363144699005070@g.us', new Poll('Cats or dogs', ['cats', 'dogs'], {
                    messageSecret: finalArray,
                    allowMultipleAnswers: true
                })); */
                await client.sendMessage(GroupId, new Poll(question, options, {
                    messageSecret: finalArray,
                    allowMultipleAnswers: chkmulti
                }))
                    .then(response => {
                        status = 'send-success-pool';
                    })
                    .catch(error => {
                        status = 'send-error-pool' + error.message;
                    });
            }
        } else {
            status = 'auth-failed';
        }
        console.log(status);
        res.send(status);
    } catch (error) {
        status = 'send-error-try';
        res.send(status);
        console.error('Error', error);
    }
});

function sendFileImage(phone, media) {
    return new Promise((resolve, reject) => {
        client.sendMessage(phone, media).then(() => {
            // El mensaje con la imagen se envió correctamente
            resolve();
        }).catch((error) => {
            // Ocurrió un error al enviar el mensaje con la imagen
            reject(error);
        });
    });
}


/* Get Group and Participants*/

app.get('/groups', async (req, res) => {
    const pass = req.query.pass;
    if (password == pass) {
        const clientChats = await client.getChats();
        const clientChatsGroup = clientChats.filter(clientChat => clientChat.isGroup);
        res.send(clientChatsGroup);
    } else {
        res.send('auth-failed');
    }
});

app.get('/mentions', async (req, res) => {
    let GroupId = req.body.GroupId;
    let linkPreview = (req.body.linkPreview == "1" ? true : false);
    let chkmentions = (req.body.chkmentions == "1" ? true : false);
    const chat = await client.getChatById(GroupId);
    let text = "";
    let mentions = [];
    if (chkmentions) {
        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);

            mentions.push(contact);
            text += `@${participant.id.user} `;
        }
    }

    text = `🔴 ¿Qué debe tener SÍ O SÍ tu landing page? 🤔

    https://pasion.net.pe/login
    
    ➡️ P.D: Recuerda que este jueves a las *8 p.m* tendremos una clase gratuita sobre *Cómo Facturar 10K EXTRA en Noviembre con el Método 3S*`;

    await client.sendMessage(GroupId, text, { mentions, linkPreview: linkPreview })

    res.send('ok');
});

const port = process.env.port || 3001;

const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, Poll, MessageMedia } = require('whatsapp-web.js');

const { Sequelize } = require('sequelize');
const sequelize = require('./sequelize');


const wwebVersion = '2.2412.54';
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
        //remotePath: `https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html`,
    },
    loadAllUnreadMessages: false,
    linkPreview: true
});

client.initialize();

client.on('qr', qr => {
    console.log('WhatsApp QR');
    qrcode.generate(qr, { small: true });
});

let client_phone;

client.on('ready', () => {
    console.log('WhatsApp esta Conectado!');
    //Listen Port Api
    app.listen(port, () => console.log(`Escuchando en puerto ${port}....`));
    //Confirm start ChatBot
    let chatId = "51912477701@c.us";
    let now = getFormattedDateTime();
    client_phone = client.info.me.user;
    console.log(client_phone);
    let msg = `*Chatbot:*  ${client_phone}\n*Status:* Success\n*Date Conection:*  ${now}`;
    client.sendMessage(chatId, msg);
});

const timeawait = 1000;

client.on('vote_update', async (vote) => {
    //let now = getFormattedDateTime();
    try {
        //console.log(vote);
        //console.log(vote.voter);

        let secret = [15, 3, 24, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        let pollsecret = vote.parentMessage.messageSecret;

        //const isEqual = JSON.stringify(secret) === JSON.stringify(pollsecret);

        //if (isEqual) {
        //console.log('Verificacion ok');

        if (vote.selectedOptions[0]) {
            //console.log(vote.voter);
            //console.log(vote.selectedOptions[0].name);
            let flow_id;
            switch (vote.selectedOptions[0].name) {
                case '😄 *Sí, quiero registrarme ahora mismo.*':
                    flow_id = 108;
                    break;
                case '✅ *Especialización.*':
                    flow_id = 108;
                    break;
                case '✅ *Curso Asincrónico.*':
                    flow_id = 125;
                    break;
                case '🏃‍♀️ *Cuentamelo todo.*':
                    flow_id = 108;
                    break;
                case '👍 *Quiero más información.*':
                    flow_id = 108;
                    break;
                case '🏃‍♀️ *Si la conozco, quiero inscribirme ahora mismo.*':
                    flow_id = 124;
                    break;
                case '👍 *No la conozco, quiero más información.*':
                    flow_id = 124;
                    break;
                case '👍 *CLARO QUE SI.*':
                    flow_id = 122;
                    break;
                case '👍 *AHORA MISMO*':
                    flow_id = 122;
                    break;
                case '✅ *Conciencia Fonológica.*':
                    flow_id = 59;
                    break;
                case '✅ *Aprende a Escribir con los Sonidos.*':
                    flow_id = 60;
                    break;
                case '✅ *Número Protagonista.*':
                    flow_id = 61;
                    break;
                case '✅ *Quiero los 3 cursos.*':
                    flow_id = 64;
                    break;
                case '1️⃣ *La Palabra (Conciencia Léxica)*':
                    flow_id = 65;
                    break;
                case '2️⃣ *La Sílaba (Conciencia Silábica)*':
                    flow_id = 66;
                    break;
                case '3️⃣ *Fonema (Conciencia Fonémica)*':
                    flow_id = 67;
                    break;
                case '4️⃣ *Todas las anteriores*':
                    flow_id = 68;
                    break;
                case '✅ *Verdadero*':
                    flow_id = 69;
                    break;
                case '❌ *Falso*':
                    flow_id = 70;
                    break;
                case '✅ *Totalmente cierto*':
                    flow_id = 71;
                    break;
                case '❌ *Totalmente falso*':
                    flow_id = 72;
                    break;
                case '✅ *S por favor.* 🥺':
                    flow_id = 64;
                    break;
                case '✅ *Si por favor.* 🥺':
                    flow_id = 64;
                    break;
                case '😉 *Yo ya compre mi curso.* 😃':
                    flow_id = 64;
                    break;
                case '🟢 *La Conciencia Léxica*':
                    flow_id = 73;
                    break;
                case '🟢 *La Conciencia Silábica*':
                    flow_id = 74;
                    break;
                case '🟢 *La Conciencia Fonémica*':
                    flow_id = 74;
                    break;
                case '*A)* Pedirles que escriban palabras completas con corrección ortográfica.':
                    flow_id = 76;
                    break;
                case '*B)* Proporcionarles hojas de trabajo con letras trazadas para que las copien.':
                    flow_id = 76;
                    break;
                case '*C)* Animarlos a hacer garabatos y escribir letras o formas que les interesen.':
                    flow_id = 75;
                    break;
                case '*D)* Dictarles oraciones completas para que las copien palabra por palabra.':
                    flow_id = 76;
                    break;
                case '✅ *Sí, me encantaría*':
                    flow_id = 60;
                    break;
                case '❌ *No sé, tengo miedo*':
                    flow_id = 60;
                    break;
                case '✅ *Si, pero quiero aprender más.*':
                    flow_id = 59;
                    break;
                case '👍 *No, pero me encantaría aprender.*':
                    flow_id = 59;
                    break;
                case '✅ *Nivel Presilábico.*':
                    flow_id = 94;
                    break;
                case '✅ *Nivel Alfabético.*':
                    flow_id = 95;
                    break;
                case '✅ *Nivel Silábico.*':
                    flow_id = 95;
                    break;
                case '✅ *Actividades físicas.*':
                    flow_id = 97;
                    break;
                case '✅ *Escribir palabras positivas sobre el amigo de la semana.*':
                    flow_id = 96;
                    break;
                case '✅ *Ver películas juntos.*':
                    flow_id = 97;
                    break;
                case '💚 *Nivel Alfabético.*':
                    flow_id = 98;
                    break;
                case '💚 *Nivel Presilabico.*':
                    flow_id = 99;
                    break;
                case '💚 *Nivel Silábico.*':
                    flow_id = 99;
                    break;
                case '✅ *CLARO QUE SI.*':
                    flow_id = 100;
                    break;
                case '👍 *NO ME LO PIERDO*':
                    flow_id = 100;
                    break;
                case '1️⃣ *Cartas entre compañeros.*':
                    flow_id = 103;
                    break;
                case '2️⃣ *Dictado de Palabras.*':
                    flow_id = 102;
                    break;
                case '3️⃣ *Álbum de Palabras.*':
                    flow_id = 103;
                    break;
                case '🔹 *SILÁBICO.*':
                    flow_id = 105;
                    break;
                case '🔹 *SÍLABICO.*':
                    flow_id = 105;
                    break;
                case '🔹 *FONÉTICO.*':
                    flow_id = 104;
                    break;
                case '🔹 *ALFABÉTICO.*':
                    flow_id = 105;
                    break;
                case '🔹 *PRESÍLABICO.*':
                    flow_id = 105;
                    break;
                case '🔹 *PRESILÁBICO.*':
                    flow_id = 105;
                    break;
                case '✅ *SI QUIERO PARTICIPAR.*':
                    flow_id = 106;
                    break;
                case '😀 *NO ME LO PIERDO.*':
                    flow_id = 106;
                    break;
                default:
                    return;
            }
            //console.log(flow_id);

            //const chatbot_id = chatbot.id;
            const chatbot_flows = await sequelize.query(
                `SELECT * FROM chatbot_flows WHERE id = ${flow_id} AND status = '1'`,
                {
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const responses = await sequelize.query(
                `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${flow_id} AND status = '1' ORDER BY sequence ASC`,
                {
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            for (const response of responses) {
                //console.log(response);
                await sendMessage(response, vote.voter);
                //await sleep(timeawait);
            }
            for (const chatbot_flow of chatbot_flows) {
                if (chatbot_flow.flow_1_id) {
                    const responses = await sequelize.query(
                        `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.flow_1_id} AND status = '1' ORDER BY sequence ASC`,
                        {
                            type: Sequelize.QueryTypes.SELECT
                        }
                    );

                    for (const response of responses) {
                        //console.log(response);
                        await sendMessage(response, vote.voter);
                        //await sleep(timeawait);
                    }
                }

                if (chatbot_flow.flow_2_id) {
                    const responses = await sequelize.query(
                        `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.flow_2_id} AND status = '1' ORDER BY sequence ASC`,
                        {
                            type: Sequelize.QueryTypes.SELECT
                        }
                    );

                    for (const response of responses) {
                        //console.log(response);
                        await sendMessage(response, vote.voter);
                        //await sleep(timeawait);
                    }
                }

                if (chatbot_flow.flow_3_id) {
                    const responses = await sequelize.query(
                        `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.flow_3_id} AND status = '1' ORDER BY sequence ASC`,
                        {
                            type: Sequelize.QueryTypes.SELECT
                        }
                    );

                    for (const response of responses) {
                        //console.log(response);
                        await sendMessage(response, vote.voter);
                        //await sleep(timeawait);
                    }
                }
            }
        }
        //}
    } catch (error) {
        //console.error('Fecha y Hora', now);
        console.error('Error', error);
    }

});

const studentsData = require('./students.js');

client.on('message', async (message) => {
    try {
        if (message.from.includes('@g.us')) {
            // Salir tempranamente si el mensaje es de un grupo
            return;
        }

        const processSingleWord = async (palabra, phrase) => {
            const palabra_final = palabra;

            const [chatbot] = await sequelize.query(
                `SELECT id FROM chatbots WHERE phone = :client_phone AND status = :status LIMIT 1`,
                {
                    replacements: {
                        client_phone: client_phone,
                        status: '1'
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const chatbot_id = chatbot.id;

            const chatbot_flows = await sequelize.query(
                //`SELECT * FROM chatbot_flows WHERE chatbot_id = ${chatbot_id} AND phrase = ${phrase} AND FIND_IN_SET(:palabra_final, REPLACE(words, " ", "")) > 0 AND status = '1'`,
                `SELECT * FROM chatbot_flows WHERE chatbot_id = ${chatbot_id} AND FIND_IN_SET(:palabra_final, REPLACE(words, " ", "")) > 0 AND status = '1'`,
                {
                    replacements: { palabra_final: palabra_final },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            let found = false;

            for (const chatbot_flow of chatbot_flows) {

                let repeat = await GetLogMinutes(message.from, chatbot_flow.id, 20);
                if (repeat) {
                    found = true;
                    break;
                }

                const responses = await sequelize.query(
                    `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.id} AND status = '1' ORDER BY sequence ASC`,
                    {
                        type: Sequelize.QueryTypes.SELECT
                    }
                );

                for (const response of responses) {
                    await sendMessage(response, message.from);
                }

                if (chatbot_flow.flow_1_id) {
                    const responses = await sequelize.query(
                        `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.flow_1_id} AND status = '1' ORDER BY sequence ASC`,
                        {
                            type: Sequelize.QueryTypes.SELECT
                        }
                    );

                    for (const response of responses) {
                        await sendMessage(response, message.from);
                    }
                }

                if (chatbot_flow.flow_2_id) {
                    const responses = await sequelize.query(
                        `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.flow_2_id} AND status = '1' ORDER BY sequence ASC`,
                        {
                            type: Sequelize.QueryTypes.SELECT
                        }
                    );

                    for (const response of responses) {
                        await sendMessage(response, message.from);
                    }
                }

                if (chatbot_flow.flow_3_id) {
                    const responses = await sequelize.query(
                        `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${chatbot_flow.flow_3_id} AND status = '1' ORDER BY sequence ASC`,
                        {
                            type: Sequelize.QueryTypes.SELECT
                        }
                    );

                    for (const response of responses) {
                        await sendMessage(response, message.from);
                    }
                }

                InsertLog(message.from, chatbot_flow.id)

                if (responses.length > 0) {
                    found = true;
                    break;
                }
            }
            return found;

        };
        // Dividir el 'message.body' en palabras individuales primero reemplazamos caracteres extraños

        const format_message = message.body.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚ]/g, '').replace(/[\(\)]/g, '');
        const palabras = format_message.split(" ");
        let phrase = 'false';
        if (palabras.length === 1) {
            // Solo hay una palabra en el mensaje

            const found = await processSingleWord(palabras[0], phrase);
            if (!found) {
                // No se encontraron palabras y se enviaron respuestas
                // console.log('No se encontraron palabras coincidentes en la tabla "words"');
            }
        } else {
            phrase = 'true';
            // Hay múltiples palabras en el mensaje, procesarlas una por una
            let found = false;
            for (const palabra of palabras) {
                if (palabra.length === 1) {
                    continue;
                }

                if (found) {
                    // Se encontraron palabras y se enviaron respuestas, detener el procesamiento
                    break;
                }

                found = await processSingleWord(palabra, phrase);
            }

            if (!found) {
                // No se encontraron palabras y se enviaron respuestas
                // console.log('No se encontraron palabras coincidentes en la tabla "words"');
            }
        }


    } catch (error) {
        // Manejo de errores
        console.error('Error al realizar la consulta:', error);
        client.sendMessage('51912477701@c.us', `Error: API ${error}`);
    }
});

async function evaluateCupon(message) {
    let phoneOrigen = message.from.split('@')[0];
    let student = studentsData[phoneOrigen];

    //console.log(phoneOrigen, student);

    let flow_id = 109;

    if (student) {
        let msg = message.body.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚ]/g, ' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        //let keyword = 'si';

        let keyword = ['si', 'SI', 'Si', 'sí', 'SÍ', 'Sí'];


        //if (msg.includes(keyword)) {
        if (keyword.includes(msg)) {


            let cuponpng = student.ID;
            let firstname = student.FIRSTNAME;
            let fullname = student.FULLNAME;
            let media = MessageMedia.fromFilePath(`./images/cupones/${cuponpng}.png`);
            let caption = `🎉 *Felicidades ${firstname}* 🪇`;
            await client.sendMessage(message.from, media, { caption: caption })
                .then(response => {
                    status = 'send-success-img';
                }).catch(error => {
                    status = 'send-error-img';
                });


            const chatbot_flows = await sequelize.query(
                `SELECT * FROM chatbot_flows WHERE id = ${flow_id} AND status = '1'`,
                {
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const responses = await sequelize.query(
                `SELECT * FROM chatbot_flow_responses WHERE chatbot_flow_id = ${flow_id} AND status = '1' ORDER BY sequence ASC`,
                {
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            for (const response of responses) {
                await sendMessage(response, message.from);
            }
            InsertLog(message.from, flow_id)
            return;
        }
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// reemplazar tiempo y moneda para los mensajes ext
const convertmessage = require('./convertmessage.js');

async function sendMessage(response, phone) {

    let linkpreview = (response.linkpreview == 1 ? true : false);


    if (response.media) {
        if (response.foreign) {
            if (phone.startsWith('51')) {
                if (response.url_media_local != '') {
                    const media = await MessageMedia.fromUrl(response.url_media_local);
                    await sendMessageWithImage(phone, media, response.message_local);
                }
            } else {
                if (response.url_media_foreign != '') {
                    const media = await MessageMedia.fromUrl(response.url_media_foreign);
                    await sendMessageWithImage(phone, media, response.message_foreign);
                }
            }
        } else {
            if (response.url_media_local != '') {
                const media = await MessageMedia.fromUrl(response.url_media_local);
                await sendMessageWithImage(phone, media, response.message_local);
            }
        }
    } else {
        if (response.foreign) {
            if (phone.startsWith('51')) {
                if (response.message_local != '') {
                    //client.sendMessage(phone, response.message_local, { linkPreview: linkpreview });
                    await sendMessageText(phone, response.message_local, linkpreview);
                }
            } else {
                if (response.message_foreign != '') {
                    let message = await convertmessage(phone, response.message_foreign);
                    //client.sendMessage(phone, message, { linkPreview: linkpreview });
                    await sendMessageText(phone, message, linkpreview);
                }
            }
        } else {
            if (response.message_local != '') {
                //client.sendMessage(phone, response.message_local, { linkPreview: linkpreview });
                await sendMessageText(phone, response.message_local, linkpreview);
            }
        }
    }
    await sleep(timeawait);
}

/* SendImagesInOrder */
function sendMessageText(phone, Text, linkOption) {
    return new Promise((resolve, reject) => {
        client.sendMessage(phone, Text, { linkPreview: linkOption }).then(() => {
            // El mensaje con la imagen se envió correctamente
            resolve();
        }).catch((error) => {
            // Ocurrió un error al enviar el mensaje con la imagen
            reject(error);
        });
    });
}

/* SendImagesInOrder */
function sendMessageWithImage(phone, media, caption) {
    return new Promise((resolve, reject) => {
        client.sendMessage(phone, media, { caption: caption }).then(() => {
            // El mensaje con la imagen se envió correctamente
            resolve();
        }).catch((error) => {
            // Ocurrió un error al enviar el mensaje con la imagen
            reject(error);
        });

        /* client.sendMessage(phone, media, { caption: caption })
            .then(response => {
                status = 'send-success-img';
            }).catch(error => {
                status = 'send-error-img';
            }); */
    });
}

/* Get Datetime to confirmn conection with WhatsApp */
function getFormattedDateTime() {
    const now = new Date();

    const zeroPad = (num, places) => String(num).padStart(places, '0');

    const day = zeroPad(now.getDate(), 2);
    const month = zeroPad(now.getMonth() + 1, 2); // Los meses en JavaScript van de 0 a 11
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = zeroPad(now.getMinutes(), 2);
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debería ser '12'
    hours = zeroPad(hours, 2);

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}


// INSERT Log 
async function InsertLog(phone, chatbot_flow_id) {
    try {
        // Obtener la fecha y hora actual
        const dateNow = new Date();

        // Realizar el INSERT utilizando sequelize.query
        await sequelize.query(
            'INSERT INTO chatbot_flow_logs (chatbot_flow_id, phone, datetime_message) VALUES (:chatbot_flow_id, :phone, :datetime_message	)',
            {
                replacements: {
                    chatbot_flow_id: chatbot_flow_id,
                    phone: phone,
                    datetime_message: dateNow
                },
                type: Sequelize.QueryTypes.INSERT
            }
        );
        //console.log('Registro insertado en la tabla Log correctamente');
    } catch (error) {
        console.error('Error al insertar en la tabla Log:', error);
    }
}


// Consultar si tuvo una interacción similar
async function GetLogMinutes(phone, chatbot_flow_id, minutes) {
    try {

        const fechaLimite = new Date();
        fechaLimite.setMinutes(fechaLimite.getMinutes() - minutes);

        //console.log(formatdatetime(fechaLimite));
        // Realizar la consulta utilizando sequelize.query
        const registrosAntiguos = await sequelize.query(
            'SELECT * FROM chatbot_flow_logs WHERE phone = :phone AND chatbot_flow_id = :chatbot_flow_id AND datetime_message >= :fechaLimite',
            {
                replacements: {
                    phone: phone,
                    chatbot_flow_id: chatbot_flow_id,
                    fechaLimite: fechaLimite
                },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        // Comprobar si se encontraron registros antiguos y retornar true o false
        //console.log(registrosAntiguos.length > 0);
        return registrosAntiguos.length > 0;
    } catch (error) {
        console.error('Error al consultar registros antiguos:', error);
        return false; // En caso de error, retornamos false
    }
}

/* FECHA Y HORA FORMAT */

function formatdatetime(fecha) {
    const now = fecha;

    const zeroPad = (num, places) => String(num).padStart(places, '0');

    const day = zeroPad(now.getDate(), 2);
    const month = zeroPad(now.getMonth() + 1, 2); // Los meses en JavaScript van de 0 a 11
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = zeroPad(now.getMinutes(), 2);
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debería ser '12'
    hours = zeroPad(hours, 2);

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

/* client.on('group_join', async (notification) => {
    // User has joined or been added to the group.
    try {
        if (notification.id.remote != '120363208262890923@g.us') {
            let codeuser = notification.id.participant.substring(0, 2);
            let user_disabled = false;

            if (codeuser == '58' || codeuser == '54' || codeuser == '53') {
                user_disabled = true;
            } else if (notification.id.participant.startsWith('505')) {
                user_disabled = true;
            }

            if (user_disabled) {
                const community = await client.getChatById(notification.id.remote);
                await community.removeParticipants([notification.id.participant]);

                const msg = await sequelize.query(
                    `SELECT message_local FROM message_responses WHERE id = :message_id AND status = :status LIMIT 1`,
                    {
                        replacements: {
                            message_id: 44,
                            status: '1'
                        },
                        type: Sequelize.QueryTypes.SELECT
                    }
                );
                let message = msg[0]?.message_local;
                client.sendMessage(notification.id.participant, message);
                console.log('Miembro eliminado', notification.id.participant);
            }
        }
    } catch (error) {
        console.error('Error al insertar en la tabla Log:', error);
    }
}); */