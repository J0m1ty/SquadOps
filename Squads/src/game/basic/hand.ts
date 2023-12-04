import { Container, Graphics } from "pixi.js";
import { Agent } from "./agent";

export class Hand {
    agent: Agent;

    container: Container = new Container();
    holding = {
        below: new Container(),
        above: new Container()
    };
    hand: Graphics = new Graphics();

    constructor(agent: Agent) {
        this.agent = agent;

        this.hand.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
        this.hand.beginFill(0xd5a98a);
        this.hand.drawCircle(0, 0, this.agent.size * 6/19);
        this.hand.endFill();
        
        this.container.addChild(this.holding.below);
        this.container.addChild(this.hand);
        this.container.addChild(this.holding.above);
    }
}