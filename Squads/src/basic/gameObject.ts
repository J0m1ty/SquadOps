import { Game } from "../main/game";
import { Container } from "@pixi/display";
import { Body } from "matter-js";

export class GameObject {
    game: Game;

    body: Body;

    container: Container = new Container();

    constructor(game: Game, body: Body) {
        this.game = game;
        
        this.body = body;
    }

    update(delta: number) {
        const { x, y, scale } = this.game.camera.worldMap({ x: this.body.position.x, y: this.body.position.y });
        this.container.position.set(x, y);

        this.container.scale.set(scale);

        this.container.rotation = this.body.angle;
    }
}