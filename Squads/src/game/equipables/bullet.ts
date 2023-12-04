import { Container, Graphics } from "pixi.js";
import { Game } from "../main/game";
import { Vector } from "../util/vector";

export class Bullet {
    game: Game;

    container: Container = new Container();

    origin: { x: number, y: number };

    pos: { x: number, y: number };
    direction: number;
    range: number;
    speed: number;

    length: number = 25;

    constructor(game: Game, origin: { x: number, y: number }, direction: number, range: number, speed: number) {
        this.game = game;
        
        this.origin = origin;

        this.pos = origin;
        this.direction = direction;
        this.range = range;
        this.speed = speed;

        const bullet = new Graphics();
        bullet.lineStyle(5, 0x000000);
        bullet.moveTo(-this.length / 2, 0);
        bullet.lineTo(this.length / 2, 0);
        bullet.rotation = direction;
        this.container.addChild(bullet);
        this.game.layers.bullets.addChild(this.container);
    }

    get destroy() {
        return Vector.distance(this.origin, this.pos) > this.range;
    }

    update(delta: number) {
        this.pos = Vector.add(this.pos, Vector.mult({ x: Math.cos(this.direction), y: Math.sin(this.direction) }, this.speed * delta));
        
        const pos = this.game.camera.in(this.pos);

        this.container.position.set(pos.x, pos.y);

        this.container.scale.set(this.game.camera.scale);
    }
}