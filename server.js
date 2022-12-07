const express = require('express');
const path = require('path');

const { readAndAppend } = require('./helpers/fsUtils');
const { writeToFile } = require('./helpers/fsUtils');
const { readFromFile } = require('./helpers/fsUtils');

const uuid = require('./helpers/uuid')

const notes = require('./db/db.json');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))));



app.post('/api/notes', (req, res) => {

    if (req.body.title && req.body.text) {
        const newNote = {
            title: req.body.title,
            text:req.body.text,
            id: uuid(),
        }
        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote
        };
        res.status(200).json(response)
    }
    else {
        res.json('Error occured when attempting to post a new note');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);