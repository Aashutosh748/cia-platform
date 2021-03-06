const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');


const admin = require('./admin');
const apiRoute = require('./routes/api');

const cors = require('cors');
const log = require('./log');

const port = process.env.PORT || 8000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/admin', admin);
app.use('/api', apiRoute);


app.use(express.static(path.resolve(`${__dirname}/client/build`)));//STATIC FOLDER IS REACTS BUILD FOLDER

app.get('/*', (req, res) => res.sendFile(path.resolve(`${__dirname}/client/build/index.html`)));

app.listen(port, () => log.serverStart());
