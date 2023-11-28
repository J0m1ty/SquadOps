import { GameAction } from "./weapons";

export class ActionInstance {
    info: GameAction;
    start: number;

    constructor(info: GameAction, start: number) {
        this.info = { ...info };
        this.start = start;
    }
}