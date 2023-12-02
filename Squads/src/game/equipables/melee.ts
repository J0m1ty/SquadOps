import { Sprite } from "pixi.js";
import { Game } from "../main/game";
import { ActionKey, GameMelee, cloneMelee } from "./definitions";
import { ActionInstance } from "./action";

export class MeleeInstance {
    info: GameMelee;

    private _sprite?: Sprite;

    constructor(info: GameMelee) {
        this.info = cloneMelee(info);
    }

    getAction = () => {
        const actions: ActionKey<any>[] = [];
        this.info.actions.forEach(action => {
            actions.push(action);
        });
        return actions[Math.floor(Math.random() * actions.length)];
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

    reset() {
        this._sprite?.removeFromParent();
    }
}