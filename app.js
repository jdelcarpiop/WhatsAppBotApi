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
    let pass = req.body.pass;
    if (password == pass) {
        const exist = await client.isRegisteredUser(req.body.phone);

        if (exist) {
            let chatId = req.body.phone + "@c.us";
            client.sendMessage(chatId, req.body.msg)
                .then(response => {
                    if (response.id.fromMe) {
                        res.send('send-success');
                    } else {
                        res.send('send-error');
                    }
                });
            if (req.body.UrlMedia != "") {
                const media = await MessageMedia.fromUrl(req.body.UrlMedia);
                client.sendMessage(chatId, media);
            }
        } else {
            res.send(`verified-failed: ${req.body.phone}`);
        }
    } else {
        res.send('auth-failed');
    }
});

/* Send Msg Group*/
app.post('/sendgroup', async (req, res) => {
    let pass = req.body.pass;
    if (password == pass) {
        let GroupId = req.body.GroupId;
        client.sendMessage(GroupId, req.body.msg)
            .then(response => {
                if (response.id.fromMe) {
                    res.send('send-success');
                } else {
                    res.send('send-error');
                }
            });
        if (req.body.UrlMedia != "") {
            const media = await MessageMedia.fromUrl(req.body.UrlMedia);
            client.sendMessage(GroupId, media);
        }
    } else {
        res.send('auth-failed');
    }
});
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

const port = process.env.port || 3001;

const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const { Sequelize } = require('sequelize');
const sequelize = require('./sequelize');



const client = new Client({
    authStrategy: new LocalAuth(),
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
    let msg = `*Chatbot:*  ${client_phone}\n*Status:* Success\n*Date Conection:*  ${now}`;
    client.sendMessage(chatId, msg)


});

client.on('message', async (message) => {
    try {
        // Verificar si el mensaje proviene de un grupo
        if (message.from.includes('@g.us')) {
            // Salir tempranamente si el mensaje es de un grupo
            return;
        }

        // Función para procesar una palabra individual
        const processSingleWord = async (palabra) => {
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
                `SELECT * FROM chatbot_flows WHERE chatbot_id = ${chatbot_id} AND FIND_IN_SET(:palabra_final, REPLACE(words, " ", "")) > 0 AND status = '1'`,
                {
                    replacements: { palabra_final: palabra_final },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            let found = false;

            for (const chatbot_flow of chatbot_flows) {

                let repeat = await GetLogMinutes(message.from, chatbot_flow.id, 60);
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
                    //console.log(response);
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
                        //console.log(response);
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
                        //console.log(response);
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
                        //console.log(response);
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

        const format_message = message.body.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚ]/g, ' ');
        const palabras = format_message.split(" ");

        if (palabras.length === 1) {
            // Solo hay una palabra en el mensaje
            const found = await processSingleWord(palabras[0]);
            if (!found) {
                // No se encontraron palabras y se enviaron respuestas
                // console.log('No se encontraron palabras coincidentes en la tabla "words"');
            }
        } else {
            // Hay múltiples palabras en el mensaje, procesarlas una por una
            let found = false;
            for (const palabra of palabras) {
                if (palabra.length === 1) {
                    continue;
                }

                found = await processSingleWord(palabra);

                if (found) {
                    // Se encontraron palabras y se enviaron respuestas, detener el procesamiento
                    break;
                }
            }

            if (!found) {
                // No se encontraron palabras y se enviaron respuestas
                // console.log('No se encontraron palabras coincidentes en la tabla "words"');
            }
        }


    } catch (error) {
        // Manejo de errores
        console.error('Error al realizar la consulta:', error);
        client.sendMessage('51912477701@c.us', 'Error: API');
    }
});

// reemplazar tiempo y moneda para los mensajes ext
const convertmessage = require('./convertmessage.js');

async function sendMessage(response, phone) {
    if (response.foreign) {
        if (phone.startsWith('51')) {
            if (response.message_local != '') {
                client.sendMessage(phone, response.message_local);
            }
        } else {
            if (response.message_foreign != '') {
                let message = await convertmessage(phone, response.message_foreign);
                client.sendMessage(phone, message);
            }
        }
    } else {
        if (response.message_local != '') {
            client.sendMessage(phone, response.message_local);
        }
    }

    if (response.media) {
        if (response.foreign) {
            if (phone.startsWith('51')) {
                if (response.url_media_local != '') {
                    const media = await MessageMedia.fromUrl(response.url_media_local);
                    await sendMessageWithImage(phone, media);
                }
            } else {
                if (response.url_media_foreign != '') {
                    const media = await MessageMedia.fromUrl(response.url_media_foreign);
                    await sendMessageWithImage(phone, media);
                }
            }
        } else {
            if (response.url_media_local != '') {
                const media = await MessageMedia.fromUrl(response.url_media_local);
                await sendMessageWithImage(phone, media);
            }
        }
    }
}

/* SendImagesInOrder */
function sendMessageWithImage(phone, media) {
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