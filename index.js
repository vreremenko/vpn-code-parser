const puppeteer = require("puppeteer");
const axios = require("axios");

const sendCode = require('./sendCode');
const {createMailBox, deleteMailBox} = require('./mailBoxCreator');

(async () => {
    const {id, email} = await createMailBox();
    await sendCode(email)
    await deleteMailBox(id);
})();

