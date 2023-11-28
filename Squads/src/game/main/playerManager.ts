import { DynamicComponent } from "../basic/component";
import { Agent } from "../basic/agent";
import { Game } from "./game";
import { Gun, guns } from "../weapons/gun";
import { Melee, melees } from "../weapons/melee";

export class PlayerManager implements DynamicComponent {
    game: Game;

    agent: Agent;

    cooldown: number = 0;

    constructor(game: Game) {
        this.game = game;

        this.agent = new Agent(game);

        this.agent.equip(melees.fists);

        this.game.input.keyboard.key(" ").press(() => {
            if (this.agent.equipped == melees.fists) {
                this.agent.equip(guns.ak47);
            }
            else if (this.agent.equipped == guns.ak47) {
                this.agent.equip(melees.sledgehammer);
            }
            else if (this.agent.equipped == melees.sledgehammer) {
                this.agent.equip(melees.karambit);
            }
            else if (this.agent.equipped == melees.karambit) {
                this.agent.equip(guns.m9);
            }
            else if (this.agent.equipped == guns.m9) {
                this.agent.equip(guns.dual_m9);
            }
            else if (this.agent.equipped == guns.dual_m9) {
                this.agent.equip(melees.bayonet);
            }
            else {
                this.agent.equip(melees.fists);
            }
        })
    }

    update(delta: number) {
        if (this.game.input.click && this.cooldown <= 0 && this.agent.equipped instanceof Melee) {
            const cooldown = this.agent.melee();
            if (cooldown) this.cooldown = cooldown;
        }

        if (this.agent.equipped instanceof Gun) {
            if (this.game.input.down != null) {
                if (this.cooldown <= 0) {
                    const cooldown = this.agent.fire();
                    if (cooldown) this.cooldown = cooldown;
                }
            }
            else {
                this.cooldown = 0;
            }
        }

        this.cooldown = Math.max(0, this.cooldown - this.game.app.ticker.elapsedMS);

        this.agent.update(delta);
    }
}