import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Bodies, Body, Composite, Engine, Runner, Vector } from 'matter-js';
import { GameObject } from '../basic/gameObject';
import Matter = require('matter-js');

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

    constructor(app: Application, engine: Engine) {
        this.app = app;
        this.engine = engine;
        
        this.app.ticker.maxFPS = 240;

        this.engine.gravity.scale = 0;

        this.app.stage.addChild(this.layers.background);
        this.app.stage.addChild(this.layers.main);
        this.app.stage.addChild(this.layers.ui);

        this.app.ticker.add(this.update.bind(this));
        
        window.addEventListener('resize', () => {
            this.updates.resize = true;
        });
    }

    gameObject?: GameObject;
    testGraphic?: Graphics;

    start() {
        console.log('EVENT: START');
        
        this.gameObject = new GameObject(this, Bodies.rectangle(0, 0, 100, 100, {
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0
        }));

        Composite.add(this.engine.world, this.gameObject.body);

        this.layers.main.addChild(this.gameObject.container);

        const graphic = new Graphics();

        graphic.beginFill(0xFF0000);
        graphic.drawRect(0, 0, 100, 100);
        graphic.alpha = 0.5;
        graphic.endFill();

        this.gameObject.container.addChild(graphic);

        this.testGraphic = new Graphics();

        this.testGraphic.beginFill(0x0000FF);
        this.testGraphic.drawRect(0, 0, 100, 100);
        this.testGraphic.alpha = 0.5;
        this.testGraphic.endFill();
        
        this.layers.main.addChild(this.testGraphic);
    }

    update(delta: number) {
        if (this.updates.resize) {
            this.resize();
            this.updates.resize = false;
        }

        if (!this.updates.loop) return;

        const raw = Vector.create(1, 1);

        if (this.gameObject) {
            Body.setVelocity(this.gameObject.body, { x: raw.x, y: raw.y });
        }

        Engine.update(this.engine, this.app.ticker.deltaMS, 1);
        this.gameObject?.update(this.app.ticker.deltaMS);

        const pos = this.testGraphic?.position;
        const vec = Vector.mult(raw, delta);
        
        this.testGraphic?.position.set(pos!.x + vec.x, pos!.y + vec.y);
    }

    resize() {
        console.log('EVENT: RESIZE');
    }
}