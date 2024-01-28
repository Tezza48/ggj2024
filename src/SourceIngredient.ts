import { Container, Rectangle, Sprite } from "pixi.js";
import gsap from "gsap";
import { IngredientInfo } from "./Ingredients";
import { IngredientDragEvent } from "./DragEvent";

export class SourceIngredient extends Container {
    constructor(public info: IngredientInfo) {
        super();

        this.eventMode = "static";
        this.hitArea = new Rectangle(0, 0, 100, 100);

        const spr = new Sprite(info.texture);
        spr.width = spr.height = 100;
        spr.scale.set(spr.scale.x, spr.scale.y);
        spr.setParent(this);

        this.on("pointerover", () => {
            gsap.to(spr, { pixi: { y: -20 }, duration: 0.05 });
        });

        this.on("pointerout", () => {
            gsap.to(spr, { pixi: { y: 0 }, duration: 0.1 });
        });

        this.on("pointerdown", (ev: PointerEvent) => {
            this.emit("startdragging", {
                pointerEvent: ev,
                info,
            } as IngredientDragEvent);
        });
    }
}
