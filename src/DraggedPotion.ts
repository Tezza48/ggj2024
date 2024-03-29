import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { IngredientInfo, mixIngredientColors } from "./Ingredients";

export class DraggedPotion extends Container {
    root: Container;
    sprite: Sprite;

    momentumResetTween?: GSAPTween;

    constructor(public ingredients: IngredientInfo[]) {
        super();

        this.root = new Container();
        this.root.setParent(this);

        this.sprite = new Sprite(Texture.from("./assets/flask.png"));
        this.sprite.setParent(this.root);
        this.sprite.anchor.set(0.5, 0);
        this.sprite.y -= 20;
        this.sprite.tint = mixIngredientColors(ingredients);
    }

    public momentum(value: number) {
        const scale = 0.03;
        if (this.momentumResetTween) {
            this.momentumResetTween.kill();
        }

        this.momentumResetTween = gsap.to(this.root, {
            rotation: 0,
            duration: Math.abs(this.root.rotation),
        });
        this.root.rotation = value * scale;
    }
}
