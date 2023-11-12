import { Application, Color, Container, Graphics } from 'pixi.js';
import { Bodies, Body, Engine } from 'matter-js';
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
    
    layers: Record<Layer, Container> = {
        background: new Container(),
        main: new Container(),
        ui: new Container()
    };

    lastWidth: number = -1;
    lastHeight: number = -1;

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

        this.resize();
    }

    testGameObjs: GameObject[] = [];
    
    start() {
        this.app.ticker.start();
        
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 10000 - 5000;
            const y = Math.random() * 10000 - 5000;
            const r = Math.random() * 15 + 5
            
            const body = Bodies.circle(x, y, r);
            
            const color = new Color(Math.random() * 0xffffff);

            const obj = new GameObject(this, body);

            obj.blipColor = color;

            this.testGameObjs.push(obj);

            const graphic = new Graphics();
            graphic.beginFill(color);
            graphic.drawCircle(0, 0, r);
            graphic.endFill();

            obj.container.addChild(graphic);
        }
    }

    update(delta: number) {
        if (this.lastWidth != this.width || this.lastHeight != this.height) {
            this.resize();
        }

        this.input.update(delta);
        this.grid.update(delta);

        for (let obj of this.testGameObjs) {
            obj.update(delta);
        }

        this.worldMap.update(delta);

        Engine.update(this.engine, this.app.ticker.deltaMS, 1);

        this.reset();
    }

    resize() {
        this.camera.resize();
        this.worldMap.resize();
        this.grid.resize();
    }

    reset() {
        this.worldMap.reset();
        this.input.reset();
    }
}