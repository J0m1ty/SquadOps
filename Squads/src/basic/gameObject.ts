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
        this.container.position.set(this.body.position.x, this.body.position.y);
        this.container.rotation = this.body.angle;
    }
}