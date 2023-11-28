import { GameGun } from "./weapons";

export class GunInstance {
    info: GameGun;
    
    constructor(info: GameGun) {
        this.info = { ...info };
    }
}