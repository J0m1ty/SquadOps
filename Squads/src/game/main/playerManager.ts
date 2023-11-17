import { DynamicComponent } from "../basic/component";
import { Agent } from "../basic/agent";
import { Game } from "./game";

export class PlayerManager implements DynamicComponent {
    game: Game;

    agent: Agent;

    cooldown: number = 0;

    constructor(game: Game) {
        this.game = game;

        this.agent = new Agent(game);
    }

    update(delta: number) {
        if (this.game.input.click && this.cooldown <= 0) {
            this.agent.punch(Math.random() > 0.5 ? 'left' : 'right');
            this.cooldown = 325;
        }

        this.cooldown = Math.max(0, this.cooldown - this.game.app.ticker.elapsedMS);

        this.agent.update(delta);
    }
}