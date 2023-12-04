import { Sprite } from "pixi.js";
import { GameGun, cloneGun } from "./definitions";
import { Game } from "../main/game";
import { Agent } from "../basic/agent";
import { lerp } from "../util/math";
import { Bullet } from "./bullet";
import { Vector } from "../util/vector";
import { raycast } from "../util/raycast";

export class GunInstance {
    agent: Agent;
    info: GameGun;

    cooldown: number = 0;
    dual: boolean = false;
    burst = { shots: 0, cooldown: 0 };

    private _sprite?: Sprite;
    private _dual?: Sprite;
    
    constructor(agent: Agent, info: GameGun) {
        this.agent = agent;
        this.info = cloneGun(info);
    }
 
    getSprite = (game: Game) => {
        if (!this._sprite) {
            this._sprite = this.applyTransform(new Sprite(game.loader.getAsset(this.info.asset.name)));
        }
        
        return this._sprite;
    }

    isDualPistol = () => "dualable" in this.info && this.info.dualable && this.dual;

    getDualSprite = (game: Game) => {
        if (this.info.type != "pistollike" || !this.isDualPistol()) return;

        if (!this._dual) {
            this._dual = this.applyTransform(new Sprite(game.loader.getAsset(this.info.asset.name)));
        }

        return this._dual;
    }

    applyTransform = (sprite: Sprite) => {
        sprite.anchor.set(this.info.asset.anchor.x, this.info.asset.anchor.y);
        sprite.position.set(this.info.asset.offset.x, this.info.asset.offset.y);
        sprite.rotation = this.info.asset.rotation;
        sprite.tint = this.info.tint;
        return sprite;
    }

    use() {
        if (!this.agent.settled) return;

        const recoil = this.info.recoil;

        if (this.info.type == "pistollike" && this.isDualPistol()) {
            const x = lerp(0, - recoil.x, 0.5);
            const y = lerp(0, recoil.y + (Math.round(Math.random()) * 2 - 1), 0.8);

            const side = Math.round(Math.random()) == 0 ? "left" : "right";
            const hand = this.info.idle[side].position;
            this.agent.hand[side].container.position.set(hand.x + x, hand.y + y);
        }
        else {
            const x = lerp(this.agent.handBox.position.x, - recoil.x, 0.5);
            const y = lerp(this.agent.handBox.position.y, recoil.y + (Math.round(Math.random()) * 2 - 1), 0.8);

            this.agent.handBox.position.set(x, y);
        }

        const angle = this.agent.actualRotation;
        const offset = this.agent.size + this.info.muzzleOffset;
        const origin = { x: this.agent.position.x + Math.cos(angle) * offset, y: this.agent.position.y + Math.sin(angle) * offset };
        const end = { x: origin.x + Math.cos(angle) * this.info.range, y: origin.y + Math.sin(angle) * this.info.range };

        const collisions = raycast(this.agent.game.engine.world.bodies, origin, end);

        const range = collisions.length > 0 ? Vector.distance(origin, collisions[0].point) : this.info.range;

        this.agent.bullets.push(new Bullet(this.agent.game, origin, angle, range, this.info.bulletVelocity));
    }

    update(delta: number) {
        switch (this.info.fireMode.type) {
            case "semi": case "auto":
                if ((this.info.fireMode.type == "auto" ? this.agent.game.input.down : this.agent.game.input.click) && this.cooldown <= 0) {
                    this.use();
                    this.cooldown = this.info.fireMode.cooldown;
                }
                break;
            case "burst":
                if ((this.info.fireMode.mode == "auto" ? this.agent.game.input.down : this.agent.game.input.click) && this.cooldown <= 0) {
                    this.burst.shots = this.info.fireMode.shots;
                    this.cooldown = this.info.fireMode.cooldown;
                }

                if (this.burst.shots > 0 && this.burst.cooldown <= 0) {
                    this.use();
                    this.burst.cooldown = this.info.fireMode.burstCooldown
                    this.burst.shots--;
                }
                break;
        }
        
        this.cooldown = Math.max(0, this.cooldown - this.agent.game.app.ticker.elapsedMS);
        this.burst.cooldown = Math.max(0, this.burst.cooldown - this.agent.game.app.ticker.elapsedMS);
    }

    reset() {
        this._sprite?.removeFromParent();
        this._dual?.removeFromParent();
    }
}