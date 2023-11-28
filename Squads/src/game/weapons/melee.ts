import { ActionKey, GameAction, GameMelee } from "./weapons";

export class MeleeInstance {
    info: GameMelee;

    constructor(info: GameMelee) {
        this.info = { ...info };
    }

    getAction = () => {
        const actions: ActionKey<any>[] = [];
        this.info.actions.forEach(action => {
            actions.push(action);
        });
        return actions[Math.floor(Math.random() * actions.length)];
    }
}