import { Container, Graphics } from "pixi.js";
import { Vector } from "../util/vector";
import { lerpXY } from "../util/math";
import { Agent } from "../basic/agent";

export class Bullet {
    agent: Agent;

    container: Container = new Container();

    start: { x: number, y: number };
    target: { x: number, y: number };
    
    private _progress: number = 0;
    velocity: number;

    length: number = 25;

    constructor(agent: Agent, start: { x: number, y: number }, target: { x: number, y: number }, velocity: number) {
        this.agent = agent;

        this.start = start;
        this.target = target;
        this.velocity = velocity;

        const bullet = new Graphics();
        //trail
        bullet.beginFill(0x000000, 0.2);
        bullet.drawRoundedRect(-this.length * 3, -5, this.length * 3, 5, 3);
        bullet.endFill();

        //bullet
        bullet.beginFill(0x000000, 0.8);
        bullet.drawRoundedRect(-this.length / 2, -5, this.length, 5, 3);
        bullet.endFill();
        bullet.rotation = Math.atan2(target.y - start.y, target.x - start.x);
        this.container.addChild(bullet);
        this.agent.game.layers.bullets.addChild(this.container);
    }

    get pos() {
        return lerpXY(this.start, this.target, this._progress);
    }

    get destroy() {
        return this._progress >= 1;
    }

    update(delta: number) {
        const distance = Vector.distance(this.start, this.target);

        this._progress += (this.velocity * delta) / distance;

        const { x, y } = this.agent.game.camera.in(this.pos);
        this.container.position.set(x, y);
        this.container.scale.set(this.agent.game.camera.scale);

        if (this.destroy) {
            this.container.destroy({
                children: true
            });

            this.agent.bullets.splice(this.agent.bullets.indexOf(this), 1);
        }
    }
}