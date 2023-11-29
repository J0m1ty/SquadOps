import { DynamicComponent } from "../basic/component";
import { Agent } from "../basic/agent";
import { Game } from "./game";
import { guns, melees } from "../weapons/weapons";
import { MeleeInstance } from "../weapons/melee";
import { GunInstance } from "../weapons/gun";

export class PlayerManager implements DynamicComponent {
    game: Game;

    agent: Agent;

    cooldown: number = 0;

    constructor(game: Game) {
        this.game = game;

        this.agent = new Agent(game);

        this.agent.equip(new MeleeInstance(melees.none.fists));

        this.game.input.keyboard.key(" ").press(() => {
            if (this.agent.equipped?.info.name == "fists") {
                this.agent.equip(new MeleeInstance(melees.singlehanded.bayonet));
            }
            else if (this.agent.equipped?.info.name == "bayonet") {
                this.agent.equip(new MeleeInstance(melees.singlehanded.karambit));
            }
            else if (this.agent.equipped?.info.name == "karambit") {
                this.agent.equip(new MeleeInstance(melees.twohanded.sledgehammer));
            }
            else if (this.agent.equipped?.info.name == "sledgehammer") {
                this.agent.equip(new GunInstance(guns.pistollike.m9));
            }
            else if (this.agent.equipped?.info.name == "m9") {
                this.agent.equip(new GunInstance(guns.twohanded.ak47));
            }
            else {
                this.agent.equip(new MeleeInstance(melees.none.fists));
            }
        });
    }

    update(delta: number) {
        if (this.game.input.click && this.cooldown <= 0 && this.agent.equipped instanceof MeleeInstance) {
            const cooldown = this.agent.melee();
            if (cooldown) this.cooldown = cooldown;
        }

        if (this.agent.equipped instanceof GunInstance) {
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