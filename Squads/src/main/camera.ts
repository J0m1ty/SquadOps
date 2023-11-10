import { clamp, map } from "../util/math";
import { Game } from "./game";

export class Camera {
    game: Game;

    position: { x: number, y: number } = { x: 0, y: 0 };
    vision: { width: number, height: number } = { width: 100, height: 100 };
    
    constructor(game: Game) {
        this.game = game;
    }
    
    worldMap(point: { x: number, y: number }) {
        const s = Math.min(this.game.width, this.game.height);
        const tx = Math.max((this.game.width - s) / 2, 0);
        const ty = Math.max((this.game.height - s) / 2, 0);

        const range = 1000;
        const x = map(point.x, - range / 2, range / 2, tx, tx + s);
        const y = map(point.y, - range / 2, range / 2, ty, ty + s);

        return { x, y, scale: s / range };
    }
}