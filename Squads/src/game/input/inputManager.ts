import { Body, Vector } from "matter-js";
import { Game } from "../main/game";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";
import { DynamicComponent } from "../basic/component";
import { clamp } from "../util/math";

export class InputManager implements DynamicComponent {
    game: Game;

    mouse: Mouse;
    keyboard: Keyboard;

    mousePos: { x: number, y: number } = { x: 0, y: 0 };

    down: boolean = false;
    button: number = 0;
    click: boolean = false;

    scrollCount: number = 0;
    scrollAmount: number = 1.33;
    scrollBounds: { min: number, max: number } = { min: -2, max: 4 };

    get maxZoom() {
        return Math.pow(this.scrollAmount, this.scrollBounds.max);
    }

    constructor(game: Game) {
        this.game = game;

        this.mouse = new Mouse();
        this.keyboard = new Keyboard();

        this.game.app.stage.eventMode = "static";

        this.game.app.stage.hitArea = this.game.app.screen;

        this.game.app.stage.addEventListener("pointermove", (e) => {
            this.mousePos = { x: e.x, y: e.y };
        });
        
        this.game.app.stage.addEventListener("mousedown", (e) => {
            this.click = true;
            this.down = true;
            this.button = [0, 1, 2].find((i) => e.button == i) ?? 0;
        });
        
        this.game.app.stage.addEventListener("mouseup", (e) => {
            this.down = false;
        });

        this.mouse.scroll((deltaY) => {
            this.scrollCount += deltaY;
            this.scrollCount = clamp(this.scrollCount, this.scrollBounds.min, this.scrollBounds.max);
            this.game.camera.zoom = Math.pow(this.scrollCount < 0 ? this.scrollAmount : (1 / this.scrollAmount), Math.abs(this.scrollCount));
        });

        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        this.keyboard.key('m').press(() => {
            this.game.gui.worldmap.setVisibility(!this.game.gui.worldmap.visible);
        }).release(() => {
            if (this.game.gui.worldmap.interactionMode != 'toggle') {
                this.game.gui.worldmap.setVisibility(false);
            }
        });
    }

    update(delta: number) {
        const center = { x: this.game.width / 2, y: this.game.height / 2};
        const diff = { x: this.mousePos.x - center.x, y: this.mousePos.y - center.y };
        const rotation = Math.atan2(diff.y, diff.x);
        this.game.playerManager.agent.rotation = rotation;

        const raw = { x: 0, y: 0 };
        if (this.keyboard.key('ArrowUp').isDown || this.keyboard.key('w').isDown) raw.y -= 1;
        if (this.keyboard.key('ArrowDown').isDown || this.keyboard.key('s').isDown) raw.y += 1;
        if (this.keyboard.key('ArrowLeft').isDown || this.keyboard.key('a').isDown) raw.x -= 1;
        if (this.keyboard.key('ArrowRight').isDown || this.keyboard.key('d').isDown) raw.x += 1;
        const move = Vector.mult(Vector.normalise(raw), 3);

        Body.setVelocity(this.game.playerManager.agent.body, move);
    }

    reset() {
        this.click = false;
    }
}