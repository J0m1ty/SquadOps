import { Sprite } from "pixi.js";
import { GameGun, cloneGun } from "./weapons";
import { Game } from "../main/game";

export class GunInstance {
    info: GameGun;

    dual: boolean = false;

    private _sprite?: Sprite;
    private _dual?: Sprite;
    
    constructor(info: GameGun) {
        this.info = cloneGun(info);
    }
 
    getSprite = (game: Game) => {
        if (!this._sprite) {
            this._sprite = this.applyTransform(new Sprite(game.loader.getAsset(this.info.asset.name)));
        }
        
        return this._sprite;
    }

    getDualSprite = (game: Game) => {
        if (this.info.type != "pistollike") return;

        if (!this._dual) {
            this._dual = this.applyTransform(new Sprite(game.loader.getAsset(this.info.asset.name)));
        }

        return this._dual;
    }

    applyTransform = (sprite: Sprite) => {
        console.log(this.info.asset.offset.x)
        sprite.anchor.set(this.info.asset.anchor.x, this.info.asset.anchor.y);
        sprite.position.set(this.info.asset.offset.x, this.info.asset.offset.y);
        sprite.rotation = this.info.asset.rotation;
        return sprite;
    }

    reset = () => {
        this._sprite?.removeFromParent();
        this._dual?.removeFromParent();
    }
}