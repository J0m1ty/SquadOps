import { Component } from "../basic/component";
import { Game } from "./game";
import "@pixi/math-extras";
import { lerp } from "../util/math";

export class Camera implements Component {
    game: Game;

    protected targetPos: { x: number, y: number } = { x: 0, y: 0 };
    protected targetZoom: number = 1

    protected _pos = this.targetPos;
    protected _zoom = this.targetZoom;

    moveEase: number = 0.5;
    scaleEase: number = 0.75;

    vision: number = 1000;
    aspectControl: number = 1;

    get position() {
        return this._pos;
    }

    set position(value: { x: number, y: number }) {
        this.targetPos = value;
    }

    get scale() {
        return this._zoom * this.aspectControl;
    }

    set zoom(value: number) {
        this.targetZoom = value;
    }
    
    constructor(game: Game) {
        this.game = game;

        this.calculate();
    }

    calculate = () => {
        const max = Math.max(this.game.width, this.game.height);

        this.aspectControl = max / this.vision;
    }

    in = (a: { x: number, y: number} | number, b?: number) => {
        const point = typeof a === "number" ? { x: a, y: b ?? a } : a;

        return {
            x: (point.x - this.position.x) * this.scale + this.game.width / 2,
            y: (point.y - this.position.y) * this.scale + this.game.height / 2
        }
    }

    out = (a: { x: number, y: number} | number, b?: number) => {
        const point = typeof a === "number" ? { x: a, y: b ?? a } : a;

        return {
            x: (point.x - this.game.width / 2) / this.scale + this.position.x,
            y: (point.y - this.game.height / 2) / this.scale + this.position.y
        }
    }

    cull = (point: { x: number, y: number }, r: number) => {
        const { width, height } = this.game;
        
        return !(point.x < -r || point.x > width + r || point.y < -r || point.y > height + r);
    }

    update(delta: number, smooth: { position: boolean, zoom: boolean } = { position: true, zoom: true }) {
        this._pos.x = smooth.position ? lerp(this._pos.x, this.targetPos.x, 1 - Math.pow(this.moveEase, delta)) : this.targetPos.x;
        this._pos.y = smooth.position ? lerp(this._pos.y, this.targetPos.y, 1 - Math.pow(this.moveEase, delta)) : this.targetPos.y;
        this._zoom = smooth.zoom ? Math.exp(lerp(Math.log(this._zoom), Math.log(this.targetZoom), 1 - Math.pow(this.scaleEase, delta))) : this.targetZoom;
    }

    resize() {
        this.calculate();
    }
}