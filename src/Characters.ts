import { Texture } from "pixi.js";
import { NeedName } from "./Ingredients";
import portrait1 from "./assets/portraits/portrait_1.png";
import portrait2 from "./assets/portraits/portrait_2.png";
import portrait3 from "./assets/portraits/portrait_3.png";
import portrait5 from "./assets/portraits/portrait_5.png";

export const Characters = [
    { texture: Texture.from(portrait1), needs: ["sweet"] },
    { texture: Texture.from(portrait2), needs: ["sour"] },
    { texture: Texture.from(portrait3), needs: ["black", "cosy"] },
    { texture: Texture.from(portrait5), needs: ["yellow", "blue"] },
] satisfies Character[];

export type Character = { texture: Texture; needs: NeedName[] };
