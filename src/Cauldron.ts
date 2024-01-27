import { Container, Sprite, Text, Texture } from "pixi.js";
import { AppContext } from "./AppContext";
import gsap from "gsap";
import {
    IngredientInfo,
    Ingredients,
    mixIngredientColors,
} from "./Ingredients";
import cauldronPng from "./assets/cauldron.png";
import cauldronLiquidPng from "./assets/cauldron_liquid.png";
import { PotionDragEvent } from "./DragEvent";

export class Cauldron extends Container {
    static MAX_INGREDIENTS = 3;
    ingredients: IngredientInfo[] = [];

    liquid: Sprite;

    constructor(private appContext: AppContext) {
        super();

        this.eventMode = "static";

        const spr = new Sprite(Texture.from(cauldronPng));
        spr.setParent(this);
        spr.anchor.set(0.5);

        this.liquid = new Sprite(Texture.from(cauldronLiquidPng));
        this.liquid.setParent(this);
        this.liquid.anchor.set(0.5);
        this.liquid.tint = "#466159";

        const text = new Text("Cauldron", { fill: "#d1d1d1" });
        text.setParent(this);
        text.anchor.set(0.5);

        this.on("pointerdown", (ev: PointerEvent) => {
            this.emit("startdragging", {
                pointerEvent: ev,
                ingredients: this.ingredients,
            } as PotionDragEvent);
        });

        this.addIngredient(Ingredients.empty);
    }

    addIngredient(info: IngredientInfo) {
        this.ingredients.unshift(info);
        this.ingredients.splice(Cauldron.MAX_INGREDIENTS);

        const color = mixIngredientColors(this.ingredients);

        gsap.to(this.liquid, { tint: color });

        console.log(this.ingredients.map((i) => i.description));
    }
}
