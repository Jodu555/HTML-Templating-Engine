const path = require('path');


const http = require('http');
const express = require('express');
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const templatingEngine = require('../src/index');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(templatingEngine({
    path: path.join(process.cwd(), 'templates'),
}));

let server;
if (process.env.https) {
    const sslProperties = {
        key: fs.readFileSync(process.env.KEY_FILE),
        cert: fs.readFileSync(process.env.CERT_FILE),
    };
    server = https.createServer(sslProperties, app)
} else {
    server = http.createServer(app);
}


// Your Middleware handlers here


const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
    console.log(`Express App Listening ${process.env.https ? 'with SSL ' : ''}on ${PORT}`);
});