import { Color, Container, Graphics } from "pixi.js";
import { Game } from "./game";
import { DynamicComponent } from "../basic/component";

export class Grid implements DynamicComponent {
    game: Game;

    grid: Graphics[] = [];

    gap: number = 400;

    container: Container = new Container();

    constructor(game: Game) {
        this.game = game;

        this.game.layers.background.addChild(this.container);

        this.generate();
    }

    generate() {
        this.grid.forEach(line => line.destroy());
        this.grid = [];

        const gap = this.gap;

        const { x: cx, y: cy } = this.game.camera.out(this.game.width / 2, this.game.height / 2);
        const [ mx, my ] = [ cx - cx % gap, cy - cy % gap ];

        const { x: tlx, y: tly } = this.game.camera.out(0, 0);
        const { x: brx, y: bry } = this.game.camera.out(this.game.width, this.game.height);

        const [ tx, ty ] = [ Math.abs(brx - tlx) / 2, Math.abs(bry - tly) / 2];

        for (let x = mx; x < mx + tx + gap; x += gap) {
            const { x: dx } = this.game.camera.in(x, tly);

            const line = new Graphics();
            line.lineStyle({ color: new Color(0x095a6e), width: 2 }).moveTo(dx, 0).lineTo(dx, this.game.height);
            this.container.addChild(line);
            this.grid.push(line);
        }

        for (let x = mx - gap; x > mx - tx - gap; x -= gap) {
            const { x: dx } = this.game.camera.in(x, tly);

            const line = new Graphics();
            line.lineStyle({ color: new Color(0x095a6e), width: 2 }).moveTo(dx, 0).lineTo(dx, this.game.height);
            this.container.addChild(line);
            this.grid.push(line);
        }

        for (let y = my; y < my + ty + gap; y += gap) {
            const { y: dy } = this.game.camera.in(tlx, y);

            const line = new Graphics();
            line.lineStyle({ color: new Color(0x095a6e), width: 2 }).moveTo(0, dy).lineTo(this.game.width, dy);
            this.container.addChild(line);
            this.grid.push(line);
        }

        for (let y = my - gap; y > my - ty - gap; y -= gap) {
            const { y: dy } = this.game.camera.in(tlx, y);

            const line = new Graphics();
            line.lineStyle({ color: new Color(0x095a6e), width: 2 }).moveTo(0, dy).lineTo(this.game.width, dy);
            this.container.addChild(line);
            this.grid.push(line);
        }
    }

    update(delta: number) {
        this.generate();
    }

    resize() {
        this.generate();
    }
}