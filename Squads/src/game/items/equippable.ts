import { AssetName } from "../assets/builder";
import { DuelHandAnimation } from "./types";

export interface Equippable {
    name: string;
    asset: AssetName;
    idle: DuelHandAnimation;
}