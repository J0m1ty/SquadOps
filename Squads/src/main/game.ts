import { Application, Container } from 'pixi.js';
import { Engine } from 'matter-js';
import { Camera } from './camera';
import { InputManager } from '../input/inputManager';
import { GameObject } from '../basic/gameObject';
import { WorldMap } from './worldMap';
import { Layer, Update,  } from '../basic/types';
import { Grid } from './grid';

export class Game {
    app: Application;
    engine: Engine;
    
    // Static Components
    input: InputManager;
    camera: Camera;

    // Dynamic Components
    worldMap: WorldMap;
    grid: Grid;
    
    updates: Record<Update, boolean> = {
        loop: true,
        resize: false
    };
    
    layers: Record<Layer, Container> = {
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
        
        this.input = new InputManager(this);
        this.camera = new Camera(this);
        this.worldMap = new WorldMap(this);
        this.grid = new Grid(this);
        
        this.app.stage.addChild(this.layers.background);
        this.app.stage.addChild(this.layers.main);
        this.app.stage.addChild(this.layers.ui);

        this.app.ticker.add(this.update.bind(this));
        
        window.addEventListener('resize', () => {
            this.updates.resize = true;
        });
    }

    testGameObjs: GameObject[] = [];
    
    start() {
        this.app.ticker.start();
    }

    update(delta: number) {
        if (!this.updates.loop) return;

        if (this.updates.resize) this.resize();
        
        this.input.update(delta);
        this.worldMap.update(delta);
        this.grid.update(delta);

        Engine.update(this.engine, this.app.ticker.deltaMS, 1);

        this.reset();
    }

    resize() {
        this.worldMap.resize();
        this.grid.resize();

        this.updates.resize = false;
    }

    reset() {
        this.worldMap.reset();
        this.input.reset();
    }
}