import { Game } from "./game";

export class Camera {
    game: Game;

    position: { x: number, y: number } = { x: 0, y: 0 };

    scale: number = 1;
    
    output: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };

    center: { x: number, y: number } = { x: 0, y: 0 };
    
    constructor(game: Game) {
        this.game = game;
    }
    
    
}