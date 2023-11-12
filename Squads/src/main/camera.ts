import { Vector } from "matter-js";
import { StaticComponent } from "../basic/component";
import { Game } from "./game";
import "@pixi/math-extras";
import { Point } from "pixi.js";

export class Camera implements StaticComponent {
    game: Game;

    position: { x: number, y: number } = { x: 0, y: 0 };
    vision: number = 1000;
    scale: number = 1;
    private _scale: number = 1;
    
    constructor(game: Game) {
        this.game = game;

        this.calculate();
    }

    calculate = () => {
        const max = Math.max(this.game.width, this.game.height);

        this._scale = max / this.vision;
    }

    in = (a: { x: number, y: number} | number, b?: number) => {
        const point = typeof a === "number" ? { x: a, y: b ?? a } : a;

        return {
            x: (point.x - this.position.x) * (this.scale * this._scale) + this.game.width / 2,
            y: (point.y - this.position.y) * (this.scale * this._scale) + this.game.height / 2,
            scale: this.scale * this._scale
        }
    }

    out = (a: { x: number, y: number} | number, b?: number) => {
        const point = typeof a === "number" ? { x: a, y: b ?? a } : a;

        return {
            x: (point.x - this.game.width / 2) / (this.scale * this._scale) + this.position.x,
            y: (point.y - this.game.height / 2) / (this.scale * this._scale) + this.position.y
        }
    }

    resize() {
        this.calculate();
    }
}