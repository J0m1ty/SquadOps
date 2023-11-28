import { DynamicComponent } from "../basic/component";
import { Agent } from "../basic/agent";
import { Game } from "./game";
import { guns, melees } from "../weapons/weapons";

export class PlayerManager implements DynamicComponent {
    game: Game;

    agent: Agent;

    cooldown: number = 0;

    constructor(game: Game) {
        this.game = game;

        this.agent = new Agent(game);

        this.agent.equip(melees.none.fists);
    }

    update(delta: number) {
        // if (this.game.input.click && this.cooldown <= 0 && this.agent.equipped instanceof Melee) {
        //     const cooldown = this.agent.melee();
        //     if (cooldown) this.cooldown = cooldown;
        // }

        // if (this.agent.equipped instanceof Gun) {
        //     if (this.game.input.down != null) {
        //         if (this.cooldown <= 0) {
        //             const cooldown = this.agent.fire();
        //             if (cooldown) this.cooldown = cooldown;
        //         }
        //     }
        //     else {
        //         this.cooldown = 0;
        //     }
        // }

        this.cooldown = Math.max(0, this.cooldown - this.game.app.ticker.elapsedMS);

        this.agent.update(delta);
    }
}