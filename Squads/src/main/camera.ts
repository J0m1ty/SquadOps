import { clamp, map } from "../util/math";
import { Game } from "./game";

type Rect = { x: number, y: number, width: number, height: number };

export class Camera {
    game: Game;

    position: { x: number, y: number } = { x: 0, y: 0 };
    scale: number = 1;
    private _output: "viewport" | Rect = "viewport";
    private _center: { x: number, y: number } = { x: 0, y: 0 };

    get output(): Rect {
        return this._output === "viewport" ? { x: 0, y: 0, width: this.game.width, height: this.game.height } : this._output;
    }

    set output(value: "viewport" | Rect) {
        this._output = value;
    }

    get center() {
        return {
            x: map(this._center.x, 0, 1, this.output.x, this.output.x + this.output.width),
            y: map(this._center.y, 0, 1, this.output.y, this.output.y + this.output.height)
        };
    }

    set center(value: { x: number, y: number }) {
        this.center01 = {
            x: map(value.x, this.output.x, this.output.x + this.output.width, 0, 1),
            y: map(value.y, this.output.y, this.output.y + this.output.height, 0, 1)
        };
    }

    set center01(value: { x: number, y: number }) {
        this._center.x = clamp(value.x, 0, 1);
        this._center.y = clamp(value.y, 0, 1);
    }
    
    constructor(game: Game) {
        this.game = game;
    }
    
    screenToWorld(point: { x: number, y: number }) {
        const outputRect = this.output;
        
        const relativeX = (point.x - outputRect.x) / outputRect.width;
        const relativeY = (point.y - outputRect.y) / outputRect.height;
        
        return {
            x: this.position.x + (relativeX * outputRect.width) / this.scale,
            y: this.position.y + (relativeY * outputRect.height) / this.scale
        };
    }
    
    worldToScreen(point: { x: number, y: number }) {
        const outputRect = this.output;
        
        const adjustedX = (point.x - this.position.x) * this.scale;
        const adjustedY = (point.y - this.position.y) * this.scale;
        
        return {
            x: outputRect.x + (adjustedX / outputRect.width),
            y: outputRect.y + (adjustedY / outputRect.height)
        };
    }
}