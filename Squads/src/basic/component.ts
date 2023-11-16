import { Game } from "../main/game";

export interface Component {
    game: Game;
}

export interface DynamicComponent extends Component {
    update(delta: number): void;

    resize?(): void;

    reset?(): void;
}