import { AssetName } from "../assets/builder";
import { DuelHandAnimation, Item } from "./types";

export interface Equippable {
    type: Item;
    name: string;
    asset: AssetName;
    idle: DuelHandAnimation;
}