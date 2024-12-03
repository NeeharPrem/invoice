const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

mongoose.connect('mongodb://localhost:27017/Invoice')
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Failed to connect Database:', err));

app.post('/sync', async (req, res) => {
    try {
        const data = req.body;
        res.status(200).send('Data synced to MongoDB');
    } catch (error) {
        res.status(500).send('Failed to sync data');
    }
});


app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});