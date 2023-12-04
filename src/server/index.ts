// express
import express from 'express';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import cors from 'cors';

const PORT = 3000;

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
        'Connection': 'keep-alive',
    });

    res.write('data: {"message": "hello world"}\n\n');

    setInterval(() => {
        console.log("sending")
        res.write('data: {"message": "hello world"}\n\n');
    }, 1000);
});


const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});