import { Game } from "../main/game";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";

export class InputManager {
    game: Game;

    mouse: Mouse;
    keyboard: Keyboard;

    mousePos: { x: number, y: number } = { x: 0, y: 0 };

    click: boolean = false;

    scrollCount: number = 0;
    scrollAmount: number = 1.33;

    constructor(game: Game) {
        this.game = game;

        this.mouse = new Mouse();
        this.keyboard = new Keyboard();
    }
}