import { Texture } from "pixi.js";
import { NeedName } from "./Ingredients";

export const Customers = [
    { sprite: Texture.WHITE, needs: ["sweet"] },
    { sprite: Texture.WHITE, needs: ["sour"] },
    { sprite: Texture.WHITE, needs: ["black", "cosy"] },
    { sprite: Texture.WHITE, needs: ["shiny", "hot"] },
] satisfies { sprite: Texture; needs: NeedName[] }[];
