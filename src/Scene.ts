import { Container, Point, Sprite, Text, Texture } from "pixi.js";
import { AppContext } from "./AppContext";

import gsap from "gsap";
import {
    IngredientInfo,
    Ingredients,
    mixIngredientColors,
} from "./Ingredients";
import { CustomerPane } from "./CustomerPane";
import flaskPng from "./flask.png";

export class Scene extends Container {
    constructor(appContext: AppContext) {
        super();

        this.eventMode = "static";

        const mainContainer = new Container();
        mainContainer.setParent(this);
        mainContainer.x = appContext.app.view.width / 3;

        const background = new Sprite(Texture.WHITE);
        background.tint = "#cfcfcf";
        background.width = (2 * appContext.app.view.width) / 3;
        background.height = appContext.app.view.height;
        background.setParent(mainContainer);
        background.name = "background";

        const cauldronPos = new Point(
            background.width / 2,
            background.height / 2,
        );

        const cauldron = new Cauldron(appContext);
        cauldron.setParent(mainContainer);
        cauldron.position.copyFrom(cauldronPos);

        let currentPotion: DraggedPotion | undefined = undefined;
        cauldron.on("startdragging", (ev: PotionDragEvent) => {
            if (currentPotion) {
                currentPotion.destroy();
            }
            currentPotion = new DraggedPotion(ev.ingredients);
            currentPotion.setParent(this);
            currentPotion.position.set(ev.pointerEvent.x, ev.pointerEvent.y);

            this.on("pointermove", onMovePotion);
            this.once("pointerup", onDropPotion);
        });

        const onDropPotion = () => {
            if (!currentPotion)
                throw new Error("Somehow, the dragged thing is undefined");

            if (
                customerPane
                    .getBounds()
                    ?.contains(currentPotion?.x, currentPotion.y)
            ) {
                // Attempt to give to customer, check against their request
                if (
                    customerPane.customer.givePotion(currentPotion.ingredients)
                ) {
                    // Trigger the game to get a new customer.
                    customerPane.getNewCustomer();
                }
            } else {
                // TODO Play drop + smash animation.
            }

            currentPotion.destroy();
            this.off("pointermove", onMovePotion);
        };

        const onMovePotion = (ev: PointerEvent) => {
            currentPotion?.position.set(ev.x, ev.y);
            currentPotion?.momentum(ev.movementX);
        };

        const onDragIngredient = (ev: IngredientDragEvent) => {
            if (currentIngredient) {
                currentIngredient.destroy();
            }
            currentIngredient = new DraggedIngredient(ev.info);
            currentIngredient.setParent(this);
            currentIngredient.position.set(
                ev.pointerEvent.x,
                ev.pointerEvent.y,
            );

            this.on("pointermove", onMoveIngredient);
            this.once("pointerup", onDropIngredient);
        };

        const ingredientContainer = new Container();
        ingredientContainer.setParent(mainContainer);

        let i = 0;
        let wrap = 4;
        for (const [name, info] of Object.entries(Ingredients)) {
            if (info == Ingredients.empty) continue;

            const potion = new SourceIngredient(info);
            potion.name = name;
            potion.position.set(
                potion.width / 2 + (i % wrap) * potion.width,
                potion.height / 2 + Math.floor(i / wrap) * potion.height + 5,
            );
            potion.setParent(ingredientContainer);

            potion.on("startdragging", onDragIngredient);
            i++;
        }

        ingredientContainer.y = cauldron.y + 150;
        ingredientContainer.x = cauldron.x - ingredientContainer.width / 2;

        let currentIngredient: DraggedIngredient | undefined = undefined;

        const onDropIngredient = () => {
            if (!currentIngredient)
                throw new Error("Somehow, the dragged thing is undefined");

            if (
                cauldron
                    .getBounds()
                    ?.contains(currentIngredient?.x, currentIngredient.y)
            ) {
                cauldron.addIngredient(currentIngredient.info);
            } else {
                // TODO Play drop + smash animation.
            }

            currentIngredient.destroy();
            this.off("pointermove", onMoveIngredient);
        };

        const onMoveIngredient = (ev: PointerEvent) => {
            currentIngredient?.position.set(ev.x, ev.y);
            currentIngredient?.momentum(ev.movementX);
        };

        const customerPane = new CustomerPane(appContext);
        // customerPane.height = appContext.app.view.height;
        // customerPane.width = appContext.app.view.width / 3;
        customerPane.setParent(this);
    }
}

type IngredientDragEvent = {
    info: IngredientInfo;
    pointerEvent: PointerEvent;
};

type PotionDragEvent = {
    ingredients: IngredientInfo[];
    pointerEvent: PointerEvent;
};

class SourceIngredient extends Container {
    constructor(public info: IngredientInfo) {
        super();

        const { color } = info;

        this.eventMode = "static";

        const spr = new Sprite(Texture.WHITE);
        spr.anchor.set(0.5);
        spr.tint = color;
        spr.width = spr.height = 50;
        spr.setParent(this);

        const border = new Sprite(Texture.WHITE);
        border.tint = "#5e5e5e";
        border.width = border.height = spr.width + 10;
        border.setParent(this);
        border.anchor.set(0.5);
        border.alpha = 0;
        border.eventMode = "none";
        this.setChildIndex(border, 0);

        this.on("pointerover", () => {
            gsap.to(border, { alpha: 1, duration: 0.05 });
        });

        this.on("pointerout", () => {
            gsap.to(border, { alpha: 0, duration: 0.1 });
        });

        this.on("pointerdown", (ev: PointerEvent) => {
            this.emit("startdragging", {
                pointerEvent: ev,
                info,
            } as IngredientDragEvent);
        });
    }
}

class DraggedIngredient extends Container {
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

class DraggedPotion extends Container {
    root: Container;
    sprite: Sprite;

    momentumResetTween?: GSAPTween;

    constructor(public ingredients: IngredientInfo[]) {
        super();
        console.log(ingredients.map((i) => i.color));

        this.root = new Container();
        this.root.setParent(this);

        this.sprite = new Sprite(Texture.from(flaskPng));
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

class Cauldron extends Container {
    static MAX_INGREDIENTS = 3;
    ingredients: IngredientInfo[] = [];

    liquid: Sprite;

    constructor(private appContext: AppContext) {
        super();

        this.eventMode = "static";

        const spr = new Sprite(Texture.WHITE);
        spr.tint = "#3e4455";
        spr.width = spr.height = 200;
        spr.setParent(this);
        spr.name = "cauldron_image";
        spr.anchor.set(0.5, 0.5);

        this.liquid = new Sprite(Texture.WHITE);
        this.liquid.width = this.liquid.height = 130;
        this.liquid.setParent(this);
        this.liquid.name = "liquid";
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
