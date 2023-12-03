import { Bodies } from "matter-js";
import { DynamicComponent } from "../basic/component";
import { Game } from "./game";
import { Color, Graphics } from "pixi.js";
import { GameObject } from "../basic/gameObject";

export class Test implements DynamicComponent {
    game: Game;

    gameObjects: GameObject[] = [];

    constructor(game: Game) {
        this.game = game;
    }

    start() {
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 10000 - 5000;
            const y = Math.random() * 10000 - 5000;
            const r = Math.random() * 100 + 5
            
            const body = Bodies.circle(x, y, r, {
                friction: 0,
                frictionAir: 0,
                frictionStatic: 0,
                isStatic: true,
                collisionFilter: {
                    category: this.game.categories.wall,
                    mask: this.game.categories.agent | this.game.categories.bullet | this.game.categories.item
                }
            });
            
            const color = new Color(Math.random() * 0xffffff);

            const obj = new GameObject(this.game, body, {
                layer: "surface",
                cull: r * 2,
            });

            this.game.gui.worldmap.register(x, y, new Graphics().beginFill(color).drawCircle(0, 0, r).endFill());

            this.gameObjects.push(obj);

            const graphic = new Graphics();
            graphic.beginFill(color);
            graphic.drawCircle(0, 0, r);
            graphic.endFill();

            obj.container.addChild(graphic);
        }
    }

    update(delta: number) {
        for (let obj of this.gameObjects) {
            obj.update(delta);
        }
    }
}