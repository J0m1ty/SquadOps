"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// express
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = require("path");
const cors_1 = __importDefault(require("cors"));
const PORT = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.set('trust proxy', 1);
app.use(express_1.default.static((0, path_1.join)(__dirname, '../public')));
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
        console.log("sending");
        res.write('data: {"message": "hello world"}\n\n');
    }, 1000);
});
const server = (0, http_1.createServer)(app);
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
