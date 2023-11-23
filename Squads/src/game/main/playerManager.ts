import { DynamicComponent } from "../basic/component";
import { Agent } from "../basic/agent";
import { Game } from "./game";
import { guns } from "../resources/gun";
import { melees } from "../resources/melee";

export class PlayerManager implements DynamicComponent {
    game: Game;

    agent: Agent;

    cooldown: number = 0;

    constructor(game: Game) {
        this.game = game;

        this.agent = new Agent(game);

        this.agent.equip(guns.ak47);
    }

    update(delta: number) {
        // if (this.game.input.click && this.cooldown <= 0) {
        //     this.agent.punch(Math.random() > 0.5 ? 'left' : 'right');
        //     this.cooldown = 325;
        // }

        this.cooldown = Math.max(0, this.cooldown - this.game.app.ticker.elapsedMS);

        this.agent.update(delta);
    }
}