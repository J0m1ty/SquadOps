import { DynamicComponent } from "../basic/component";
import { Agent } from "../basic/agent";
import { Game } from "./game";
import { guns, melees } from "../equipables/definitions";

export class PlayerManager implements DynamicComponent {
    game: Game;

    agent: Agent;

    constructor(game: Game) {
        this.game = game;

        this.agent = new Agent(game);

        this.agent.equip(melees.none.fists);

        this.game.input.keyboard.key(" ").press(() => {
            if (this.agent.equipped?.info.name == "fists") {
                this.agent.equip(melees.singlehanded.bayonet);
            }
            else if (this.agent.equipped?.info.name == "bayonet") {
                this.agent.equip(melees.singlehanded.karambit);
            }
            else if (this.agent.equipped?.info.name == "karambit") {
                this.agent.equip(melees.twohanded.sledgehammer);
            }
            else if (this.agent.equipped?.info.name == "sledgehammer") {
                this.agent.equip(guns.pistollike.m9);
            }
            else if (this.agent.equipped?.info.name == "m9") {
                this.agent.equip(guns.riflelike.ak47);
            }
            else if (this.agent.equipped?.info.name == "ak47") {
                this.agent.equip(guns.riflelike.famas);
            }
            else {
                this.agent.equip(melees.none.fists);
            }
        });
    }

    update(delta: number) {
        this.agent.update(delta);
    }
}