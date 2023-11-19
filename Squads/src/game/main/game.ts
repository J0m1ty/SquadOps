import { Application, Container } from 'pixi.js';
import { Engine } from 'matter-js';
import { InputManager } from '../input/inputManager';
import { GameObject } from '../basic/gameObject';
import { Layer } from '../basic/types';
import { Grid } from './grid';
import { PlayerManager } from './playerManager';
import { TrackingCamera } from './trackingCamera';
import { Debug } from './debug';
import { Fonts } from '../basic/fonts';
import { UIManager } from '../gui/uiManager';
import { Test } from './test';
import { Asset, Loader } from '../assets/loader';

export class Game {
    app: Application;
    engine: Engine;
    
    // Components
    loader: Loader;
    fonts: Fonts;
    debug: Debug;
    input: InputManager;
    playerManager: PlayerManager;
    camera: TrackingCamera<GameObject>;
    gui: UIManager;
    grid: Grid;
    test: Test;
    
    layers: Record<Layer, Container> = {
        background: new Container(),
        surface: new Container(),
        player: new Container(),
        ui: new Container(),
        debug: new Container()
    };

    lastWidth: number = -1;
    lastHeight: number = -1;

    get width() {
        return this.app.view.width;
    }

    get height() {
        return this.app.view.height;
    }
    
    constructor(app: Application, engine: Engine, ) {
        this.app = app;
        this.engine = engine;

        this.app.stage.addChild(this.layers.background);
        this.app.stage.addChild(this.layers.surface);
        this.app.stage.addChild(this.layers.player);
        this.app.stage.addChild(this.layers.ui);
        this.app.stage.addChild(this.layers.debug);
        
        this.loader = new Loader(this);
        this.fonts = new Fonts(this);
        this.debug = new Debug(this);
        this.input = new InputManager(this);
        this.playerManager = new PlayerManager(this);
        this.camera = new TrackingCamera(this, this.playerManager.agent);
        this.gui = new UIManager(this);
        this.grid = new Grid(this);
        this.test = new Test(this);

        this.app.ticker.add(this.update.bind(this));
    }
    
    start() {
        this.app.ticker.start();
        
        this.test.start();

        this.gui.builder.start();
    }

    update(delta: number) {
        if (this.lastWidth != this.width || this.lastHeight != this.height) {
            this.resize();
        }

        this.lastWidth = this.width;
        this.lastHeight = this.height;

        this.debug.set("FPS", `${Math.round(this.app.ticker.FPS)}`);
        this.debug.set("POS", `${Math.round(this.playerManager.agent.position.x)}, ${Math.round(this.playerManager.agent.position.y)}`);
        this.debug.set("ROT", `${Math.round(this.playerManager.agent.rotation * 180 / Math.PI)}`);

        this.debug.update(delta);
        this.input.update(delta);
        this.camera.update(delta);
        this.grid.update(delta);
        this.playerManager.update(delta);
        this.gui.update(delta);
        this.test.update(delta);

        Engine.update(this.engine, this.app.ticker.deltaMS, 1);

        this.reset();
    }

    resize() {
        this.gui.resize();
        this.camera.resize();
        this.grid.resize();
    }

    reset() {
        this.input.reset();
        this.debug.reset();
    }
}