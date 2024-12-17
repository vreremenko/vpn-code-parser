const axios = require("axios");

const urlApi = 'https://app.addy.io/api/v1/aliases';
const headers = {
    "Authorization": "Bearer addy_io_k9onTFFR1U6Gz14X13Fw2AnOyjNB3wKHMa2SQtiH0fe37d1f",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
};

async function createMailBox() {
    const body = {
        "domain": "vovan4ik9696.anonaddy.com",
    };

    console.log('Создание почтового ящика...')

    const {data: {data}} = await axios.post(urlApi, body, {headers});
    const {id, email} = data

    console.log(`ID нового ящика: ${id}\nИмя нового ящика: ${email}`)

    return {id, email}
}

async function deleteMailBox(id) {
    try {
        const aliasUrlApi = `${urlApi}/${id}`;
        const {data: {data}} = await axios.get(aliasUrlApi, {headers});
        const messagesCount = await getMessagesCount(id)
        if (messagesCount > 1) {
            await axios.delete(aliasUrlApi, {headers});
            console.log(`Ящик: ${data.email} - удален.`)
        } else {
            console.log('Ждем верификации email...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return await deleteMailBox(id)
        }

    } catch (e) {
        console.log(e.response.data.message)
    }
}

async function getMessagesCount(id) {
    try {
        const aliasUrlApi = `${urlApi}/${id}`;
        const {data: {data}} = await axios.get(aliasUrlApi, {headers});

        return data.emails_forwarded;
    } catch (e) {
        console.log(e.response.data.message)
    }
}


module.exports = {createMailBox, deleteMailBox};

