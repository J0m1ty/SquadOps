import { Application } from '@pixi/app';
import { Engine } from 'matter-js';

export class Game {
    app: Application;
    engine: Engine;

    constructor(app: Application, engine: Engine) {
        this.app = app;
        this.engine = engine;
    }

    start() {
        console.log('Game started!');
    }
}