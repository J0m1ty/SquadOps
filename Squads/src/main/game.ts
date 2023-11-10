import { Application, Container, Graphics } from 'pixi.js';
import { Bodies, Body, Composite, Engine } from 'matter-js';
import { Camera } from './camera';
import { InputManager } from '../input/inputManager';
import { GameObject } from '../basic/gameObject';

export class Game {
    app: Application;
    engine: Engine;

    input: InputManager;
    camera: Camera;
    
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
        
        this.input = new InputManager(this);
        this.camera = new Camera(this);
        
        this.app.stage.addChild(this.layers.background);
        this.app.stage.addChild(this.layers.main);
        this.app.stage.addChild(this.layers.ui);
        
        this.app.ticker.add(this.update.bind(this));
        
        window.addEventListener('resize', () => {
            this.updates.resize = true;
        });

        for (let i = 0; i < 100; i++) {

            let testGameObj = new GameObject(this, Bodies.circle(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 10, {
                isStatic: true
            }));

            const graphic = new Graphics();
            graphic.beginFill(0xff0000);
            graphic.drawCircle(0, 0, 10);
            graphic.endFill();

            Composite.add(this.engine.world, testGameObj.body);

            testGameObj.container.addChild(graphic);

            this.layers.main.addChild(testGameObj.container);

            this.testGameObjs.push(testGameObj);
        }

        this.testPlayer = new GameObject(this, Bodies.circle(0, 0, 20, {
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0,
        }));

        Composite.add(this.engine.world, this.testPlayer.body)

        const graphic = new Graphics();

        graphic.beginFill(0x00ff00);
        graphic.drawCircle(0, 0, 20);
        graphic.endFill();
        
        this.testPlayer.container.addChild(graphic);

        this.layers.main.addChild(this.testPlayer.container);
    }

    testGameObjs: GameObject[] = [];
    testPlayer: GameObject;
    
    start() {
        this.app.ticker.start();
    }

    update(delta: number) {
        if (!this.updates.loop) return;

        if (this.updates.resize) this.resize();

        this.input.update(delta);
        
        for (let i = 0; i < this.testGameObjs.length; i++) {
            this.testGameObjs[i].update(delta);
        }

        this.testPlayer.update(delta);

        Engine.update(this.engine, this.app.ticker.deltaMS, 1);

        this.reset();
    }

    resize() {
        this.updates.resize = false;
    }

    reset() {
        this.input.reset();
    }
}