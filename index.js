const express = require("express");

const sendCode = require('./sendCode');
const {createMailBox, deleteMailBox} = require('./mailBoxCreator');

const app = express();

app.get('/', async (req, res) => {
    try {
        const {id, email} = await createMailBox();
        await sendCode(email)
        await deleteMailBox(id);
        res.send("Process complete successfully.");
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred.");
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


