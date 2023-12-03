import { Sprite } from "pixi.js";
import { Game } from "../main/game";
import { GameAction, GameMelee, actions, cloneMelee } from "./definitions";
import { ActionInstance } from "./action";
import { Agent } from "../basic/agent";

export class MeleeInstance {
    agent: Agent;
    info: GameMelee;

    cooldown: number = 0;

    private _sprite?: Sprite;

    constructor(agent: Agent, info: GameMelee) {
        this.agent = agent;
        this.info = cloneMelee(info);
    }

    use = (): number => {
        if (!this.agent.settled) return 0;

        const name = Array.from(this.info.actions)[Math.floor(Math.random() * this.info.actions.size)];

        const action = Object.values(actions).flatMap<GameAction>(actionType => Object.values(actionType)).find(action => action.name === name);
        if (action == null) return 0;

        this.agent.actions.push(new ActionInstance(this.agent, action, this.agent.game.app.ticker.lastTime));

        return action.cooldown;
    }

    getSprite = (game: Game) => {
        if (!("asset" in this.info)) return;

        if (!this._sprite) {
            this._sprite = this.applyTransform(new Sprite(game.loader.getAsset(this.info.asset.name)));
        }

        return this._sprite;
    }

    applyTransform = (sprite: Sprite) => {
        if (!("asset" in this.info)) return sprite;
        
        sprite.anchor.set(this.info.asset.anchor.x, this.info.asset.anchor.y);
        sprite.position.set(this.info.asset.offset.x, this.info.asset.offset.y);
        sprite.rotation = this.info.asset.rotation;
        return sprite;
    }

    update() {
        if (this.agent.game.input.click && this.cooldown <= 0) {
            this.cooldown = this.use();
        }

        this.cooldown = Math.max(0, this.cooldown - this.agent.game.app.ticker.elapsedMS);
    }

    reset() {
        this._sprite?.removeFromParent();
    }
}