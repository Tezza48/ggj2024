import {
    ColorSource,
    Container,
    Point,
    Sprite,
    Text,
    Texture,
    Ticker,
} from "pixi.js";
import { AppContext } from "./AppContext";

import flaskImage from "./flask.png";
import { FolderApi, Pane, TextBladeApi } from "tweakpane";
import gsap from "gsap";
import { IngredientInfo, Ingredients } from "./Ingredients";
import { CustomerPane } from "./CustomerPane";

export class CauldronScene extends Container {
    constructor(appContext: AppContext) {
        super();

        this.eventMode = "static";

        const background = new Sprite(Texture.WHITE);
        background.tint = "#cfcfcf";
        background.width = appContext.app.view.width;
        background.height = appContext.app.view.height;
        background.setParent(this);
        background.name = "background";

        const cauldronPos = new Point(
            (2 * background.width) / 3,
            background.height / 2,
        );

        const cauldron = new Cauldron(appContext);
        cauldron.setParent(this);
        cauldron.position.copyFrom(cauldronPos);

        const ctx = {
            x: 0,
            y: 0,
        };

        const gui = appContext.tweakpane.addFolder({ title: "Mouse" });

        gui.addBinding(ctx, "x");
        gui.addBinding(ctx, "y");

        this.on("pointerdown", (ev: PointerEvent) => {
            ctx.x = ev.x - cauldron.x;
            ctx.y = ev.y - cauldron.y;
            gui.refresh();
        });

        const onStartDragging = (ev: PotionDragEvent) => {
            if (currentDragged) {
                currentDragged.destroy();
            }
            currentDragged = new DraggedPotion(ev.info);
            currentDragged.setParent(this);
            currentDragged.position.set(ev.pointerEvent.x, ev.pointerEvent.y);

            this.on("pointermove", onMove);
            this.once("pointerup", drop);
        };

        const ingredientContainer = new Container();
        ingredientContainer.setParent(this);

        let i = 0;
        let wrap = 5;
        for (const [name, info] of Object.entries(Ingredients)) {
            const potion = new SourcePotion(info);
            potion.name = name;
            potion.position.set(
                potion.width / 2 + (i % wrap) * potion.width + 15,
                potion.height / 2 + Math.floor(i / wrap) * potion.height + 5,
            );
            potion.setParent(ingredientContainer);

            potion.on("startdragging", onStartDragging);
            i++;
        }

        ingredientContainer.y = cauldron.y + 150;
        ingredientContainer.x = cauldron.x - ingredientContainer.width / 2;

        // const ingredients = [
        //     {
        //         ingredient: Ingredients.lime,
        //         position: new Point(-150, -150),
        //     },
        //     {
        //         ingredient: Ingredients.blueberry,
        //         position: new Point(-210, -210),
        //     },
        //     {
        //         ingredient: Ingredients.lemon,
        //         position: new Point(-210, -150),
        //     },
        //     {
        //         ingredient: Ingredients.chocolate,
        //         position: new Point(-150, -210),
        //     },
        //     {
        //         ingredient: Ingredients.orange,
        //         position: new Point(+210, -210),
        //     },
        //     {
        //         ingredient: Ingredients.banana,
        //         position: new Point(+150, -150),
        //     },
        //     {
        //         ingredient: Ingredients.cuddle,
        //         position: new Point(-150, -150),
        //     },
        //     {
        //         ingredient: Ingredients.cuddle,
        //         position: new Point(-150, -150),
        //     },
        // ] satisfies { ingredient: IngredientInfo; position: Point }[];

        // for (const { position, ingredient } of ingredients) {
        //     const potion = new SourcePotion(ingredient);
        //     potion.position.copyFrom(position);
        //     potion.setParent(ingredientContainer);

        //     potion.on("startdragging", onStartDragging);
        // }

        // TODO WT: Automatic layout of ingredients.

        let currentDragged: DraggedPotion | undefined = undefined;

        const drop = () => {
            if (!currentDragged)
                throw new Error("Somehow, the dragged thing is undefined");

            if (
                cauldron
                    .getBounds()
                    ?.contains(currentDragged?.x, currentDragged.y)
            ) {
                cauldron.addIngredient(currentDragged.info);
            } else {
                // TODO Play drop + smash animation.
            }

            currentDragged.destroy();
            this.off("pointermove", onMove);
        };

        const onMove = (ev: PointerEvent) => {
            currentDragged?.position.set(ev.x, ev.y);
            currentDragged?.momentum(ev.movementX);
        };

        const customerPane = new CustomerPane(appContext);
        customerPane.height = appContext.app.view.height;
        customerPane.width = appContext.app.view.width / 3;
        customerPane.setParent(this);
    }
}

type PotionDragEvent = {
    info: IngredientInfo;
    pointerEvent: PointerEvent;
};

class SourcePotion extends Container {
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
            } as PotionDragEvent);
        });
    }
}

class DraggedPotion extends Container {
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
        this.sprite.tint = color;

        const border = new Sprite(Texture.WHITE);
        border.setParent(this.root);
        this.root.setChildIndex(border, 0);
        border.tint = "#94a2bb";
        border.width = this.sprite.width + 10;
        border.height = this.sprite.height + 5;
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

class Cauldron extends Container {
    static MAX_INGREDIENTS = 3;
    ingredients: IngredientInfo[] = [];

    liquid: Sprite;

    constructor(private appContext: AppContext) {
        super();

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
    }

    addIngredient(info: IngredientInfo) {
        this.ingredients.unshift(info);
        this.ingredients.splice(3);

        const [r, g, b] = this.ingredients
            .map((i) => i.color)
            .map(
                (c) =>
                    gsap.utils.splitColor(c, false) as [number, number, number],
            )
            .reduceRight(
                ([pr, pg, pb], [cr, cg, cb]) =>
                    [pr + cr, pg + cg, pb + cb] as const,
            )
            .map((c) => c / this.ingredients.length);

        gsap.to(this.liquid, { tint: `rgb(${r}, ${g}, ${b})` });

        console.log(this.ingredients);
    }
}
