import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { IngredientInfo } from "./Ingredients";

export class DraggedIngredient extends Container {
    root: Container;
    sprite: Sprite;

    momentumResetTween?: GSAPTween;

    constructor(public info: IngredientInfo) {
        super();

        const { color } = info;

        this.root = new Container();
        this.root.setParent(this);

        this.sprite = new Sprite(Texture.WHITE);
        this.sprite.setParent(this.root);
        this.sprite.width = 30;
        this.sprite.height = 100;
        this.sprite.anchor.set(0.5, 0);
        this.sprite.y -= 5;
        this.sprite.tint = color;

        const border = new Sprite(Texture.WHITE);
        border.setParent(this.root);
        this.root.setChildIndex(border, 0);
        border.tint = "#94a2bb";
        border.width = this.sprite.width + 10;
        border.height = this.sprite.height + 5;
        border.y -= 5;
        border.anchor.set(0.5, 0);
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
