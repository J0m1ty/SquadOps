import { Application, Container } from 'pixi.js';
import { Engine } from 'matter-js';
import { InputManager } from '../input/inputManager';
import { GameObject } from '../basic/gameObject';
import { Grid } from './grid';
import { PlayerManager } from './playerManager';
import { TrackingCamera } from './trackingCamera';
import { Debug } from './debug';
import { Fonts } from '../basic/fonts';
import { UIManager } from '../gui/uiManager';
import { Test } from './test';
import { AssetLoader, Loader } from './loader';

export type Layer = 'background' | 'surface' | 'player' | 'ui' | 'debug';

export class Game {
    app: Application;
    engine: Engine;
    
    // Initialization components
    loader: AssetLoader;
    fonts: Fonts;

    // Game components
    debug!: Debug;
    input!: InputManager;
    playerManager!: PlayerManager;
    camera!: TrackingCamera<GameObject>;
    gui!: UIManager;
    grid!: Grid;
    test!: Test;
    
    // Layers
    layers: Record<Layer, Container> = {
        background: new Container(),
        surface: new Container(),
        player: new Container(),
        ui: new Container(),
        debug: new Container()
    };

    // Game state
    loaded: boolean = false;
    started: boolean = false;

    // Window
    lastWidth: number = -1;
    lastHeight: number = -1;

    get width() {
        return this.app.view.width;
    }

    get height() {
        return this.app.view.height;
    }
    
    constructor(app: Application, engine: Engine, {load, onUpdate, onProgress, onComplete}: Loader) {
        this.app = app;
        this.engine = engine;
        
        this.fonts = new Fonts(this);
        this.loader = new AssetLoader(this);

        this.loader.load({ load, onUpdate, onProgress,
            onComplete: () => {
                this.initialize();
                onComplete?.();
            }
        });
    }

    private initialize() {
        this.app.stage.addChild(this.layers.background);
        this.app.stage.addChild(this.layers.surface);
        this.app.stage.addChild(this.layers.player);
        this.app.stage.addChild(this.layers.ui);
        this.app.stage.addChild(this.layers.debug);
        
        this.debug = new Debug(this);
        this.input = new InputManager(this);
        this.playerManager = new PlayerManager(this);
        this.camera = new TrackingCamera(this, this.playerManager.agent);
        this.gui = new UIManager(this);
        this.grid = new Grid(this);
        this.test = new Test(this);

        this.app.ticker.add(this.update.bind(this));

        this.loaded = true;
    }
    
    start() {
        if (!this.loaded) throw new Error(`Cannot start game before loading assets!`);

        this.test.start();

        this.gui.builder.start();
        this.app.ticker.start();

        this.started = true;
    }

    private update(delta: number) {
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

    private resize() {
        this.gui.resize();
        this.camera.resize();
        this.grid.resize();
    }

    private reset() {
        this.input.reset();
        this.debug.reset();
    }
}