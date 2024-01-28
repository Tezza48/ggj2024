import { Container, Sprite, Texture } from "pixi.js";
import { AppContext } from "./AppContext";
import gsap from "gsap";
import {
    IngredientInfo,
    Ingredients,
    mixIngredientColors,
} from "./Ingredients";
import { PotionDragEvent } from "./DragEvent";

export class Cauldron extends Container {
    static MAX_INGREDIENTS = 3;
    ingredients: IngredientInfo[] = [];

    liquid: Sprite;

    constructor(public appContext: AppContext) {
        super();

        this.eventMode = "static";

        const spr = new Sprite(Texture.from("./assets/cauldron.png"));
        spr.setParent(this);
        spr.anchor.set(0.5);

        this.liquid = new Sprite(Texture.from("./assets/cauldron_liquid.png"));
        this.liquid.setParent(this);
        this.liquid.anchor.set(0.5);
        this.liquid.tint = "#466159";

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
