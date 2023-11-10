import { Body, Vector } from "matter-js";
import { Game } from "../main/game";
import { clamp } from "../util/math";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";
import * as PIXI from 'pixi.js';

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

        this.game.app.stage.eventMode = "static";

        this.game.app.stage.hitArea = this.game.app.screen;

        this.game.app.stage.addEventListener("pointermove", (e) => {
            this.mousePos = { x: e.x, y: e.y };
        });

        this.game.app.stage.addEventListener("click", (e) => {
            this.click = true;
        });

        // this.mouse.scroll((deltaY) => {
        //     this.scrollCount += deltaY;
        //     this.scrollCount = clamp(this.scrollCount, -2, 4);
        //     this.game.camera.scale = Math.pow(this.scrollCount < 0 ? this.scrollAmount : (1 / this.scrollAmount), Math.abs(this.scrollCount));
        // });
    }

    update(delta: number) {
        const raw = { x: 0, y: 0 };
        if (this.keyboard.key('ArrowUp').isDown || this.keyboard.key('w').isDown) raw.y -= 1;
        if (this.keyboard.key('ArrowDown').isDown || this.keyboard.key('s').isDown) raw.y += 1;
        if (this.keyboard.key('ArrowLeft').isDown || this.keyboard.key('a').isDown) raw.x -= 1;
        if (this.keyboard.key('ArrowRight').isDown || this.keyboard.key('d').isDown) raw.x += 1;
        const move = Vector.mult(Vector.normalise(raw), 1);

        Body.setVelocity(this.game.testPlayer.body, move);
    }

    reset() {
        this.click = false;
    }
}