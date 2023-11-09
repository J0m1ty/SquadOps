import { Application, Container } from 'pixi.js';
import { Engine } from 'matter-js';

export class Game {
    app: Application;
    engine: Engine;
    
    updates: { [key: string]: boolean } = {
        loop: true,
        resize: false
    };
    
    layers: { [key: string]: Container } = {
        background: new Container(),
        main: new Container(),
        ui: new Container()
    };

    get width() {
        return this.app.view.width;
    }

    get height() {
        return this.app.view.height;
    }
    
    constructor(app: Application, engine: Engine) {
        this.app = app;
        this.engine = engine;
        
        this.engine.gravity.scale = 0;
        
        this.app.stage.addChild(this.layers.background);
        this.app.stage.addChild(this.layers.main);
        this.app.stage.addChild(this.layers.ui);
        
        this.app.ticker.add(this.update.bind(this));
        
        window.addEventListener('resize', () => {
            this.updates.resize = true;
        });
    }
    
    start() {
        this.app.ticker.start();
    }

    update(delta: number) {
        if (this.updates.resize) {
            this.resize();
            this.updates.resize = false;
        }

        Engine.update(this.engine, this.app.ticker.deltaMS, 1);
    }

    resize() {
        
    }
}