// express
import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { join } from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.set('trust proxy', 1);

app.use(express.static(join(__dirname, '../public')));

app.get('/', (req, res, next) => {
    try {
        res.sendFile('../public/index.html');
    }
    catch (err) {
        next(err);
    }
});

app.get('/sse', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write('data: {"message": "hello world"}\n\n');

    setInterval(() => {
        res.write('data: {"message": "hello world"}\n\n');
    }, 1000);
});

const server = createServer({
    cert: readFileSync('/etc/letsencrypt/live/jomity.net/cert.pem'),
    key: readFileSync('/etc/letsencrypt/live/jomity.net/privkey.pem')
}, app);

server.listen(3031, () => {
    console.log('Listening on port 3031');
});