import { StaticComponent } from "../basic/component";
import { Game } from "./game";

export class Camera implements StaticComponent {
    game: Game;

    position: { x: number, y: number } = { x: 0, y: 0 };
    vision: { width: number, height: number } = { width: 100, height: 100 };
    
    constructor(game: Game) {
        this.game = game;
    }
}