import { Point } from "pixi.js";
import { GameObject } from "../basic/gameObject";
import { Camera } from "./camera";
import { Game } from "./game";

export class TrackingCamera<T extends GameObject | Point> extends Camera {
    target: T;

    constructor(game: Game, target: T) {
        super(game);

        this.target = target;
    }

    update(delta: number) {
        const pos = this.target instanceof Point ? this.target : this.target.position;

        this.position = {
            x: pos.x,
            y: pos.y
        };

        super.update(delta, { position: false, zoom: true });
    }
}