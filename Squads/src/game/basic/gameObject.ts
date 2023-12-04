import { Game } from "../main/game";
import { Container } from "@pixi/display";
import { Body, Composite } from "matter-js";
import { GraphicsLayer } from "../main/game";
import { DynamicComponent } from "./component";
import { Point } from "pixi.js";

export class GameObject implements DynamicComponent {
    game: Game;

    body: Body;

    container: Container = new Container();

    info: {
        trackBodyRotation: boolean,
        cull?: number
    } = {
        trackBodyRotation: true
    }

    get position() {
        return this.body.position;
    }

    constructor(game: Game, body: Body, options: { layer: GraphicsLayer, cull?: "auto" | number }) {
        this.game = game;
        
        this.body = body;
        Composite.add(this.game.engine.world, this.body);

        this.game.layers[options.layer].addChild(this.container);

        if (options.cull) {
            if (options.cull == "auto") {
                this.container.cullable = true;
            } else {
                this.info.cull = options.cull;
            }
        }
    }

    update(delta: number) {
        const pos = this.game.camera.in(new Point( this.position.x, this.position.y ));

        if (this.info.cull) {
            this.container.visible = this.container.renderable = this.game.camera.cull(pos, this.info.cull);
        }

        this.container.position.set(pos.x, pos.y);

        this.container.scale.set(this.game.camera.scale);

        if (this.info.trackBodyRotation) {
            this.container.rotation = this.body.angle;
        }
    }
}