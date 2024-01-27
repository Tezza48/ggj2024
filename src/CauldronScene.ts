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
import { Pane } from "tweakpane";
import gsap from "gsap";

export class CauldronScene extends Container {
    constructor(appContext: AppContext) {
        super();

        this.eventMode = "static";

        const background = new Sprite(Texture.WHITE);
        background.tint = "#aa9969";
        background.width = appContext.app.view.width;
        background.height = appContext.app.view.height;
        background.setParent(this);
        background.name = "background";

        const center = new Point(background.width / 2, background.height / 2);

        const cauldron = new Cauldron();
        cauldron.setParent(this);
        cauldron.position.copyFrom(center);

        const sourcePotion = new SourcePotion({ color: "#78ad78" });
        sourcePotion.position.set(center.x - 150, center.y - 150);
        sourcePotion.setParent(this);

        const sourcePotion1 = new SourcePotion({ color: "#6db6aa" });
        sourcePotion1.position.set(center.x + 150, center.y - 150);
        sourcePotion1.setParent(this);

        const sourcePotion2 = new SourcePotion({ color: "#ac6d49" });
        sourcePotion2.position.set(center.x + 150, center.y + 150);
        sourcePotion2.setParent(this);

        const sourcePotion3 = new SourcePotion({ color: "#6371b1" });
        sourcePotion3.position.set(center.x - 150, center.y + 150);
        sourcePotion3.setParent(this);

        let currentDragged: DraggedPotion | undefined = undefined;

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
        sourcePotion.on("startdragging", onStartDragging);
        sourcePotion1.on("startdragging", onStartDragging);
        sourcePotion2.on("startdragging", onStartDragging);
        sourcePotion3.on("startdragging", onStartDragging);

        const drop = () => {
            if (!currentDragged)
                throw new Error("Somehow, the dragged thing is undefined");

            console.log("drop");

            if (
                cauldron
                    .getBounds()
                    ?.contains(currentDragged?.x, currentDragged.y)
            ) {
                cauldron.addIngredient(currentDragged.info);
                console.log("is over cauldron");
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
    }
}

// class DragManager {}

// class DragArena extends Container {}

type IngredientInfo = {
    color: ColorSource;
};

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
            gsap.to(border, { alpha: 1, duration: 0.1 });
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
    sprite: Sprite;

    momentumResetTween?: GSAPTween;
    constructor(public info: IngredientInfo) {
        super();

        const { color } = info;

        const spr = new Sprite(Texture.WHITE);
        spr.setParent(this);
        spr.width = 30;
        spr.height = 100;
        spr.anchor.set(0.5, 0);
        spr.tint = color;
        this.sprite = spr;
    }

    public momentum(value: number) {
        const scale = 0.03;
        if (this.momentumResetTween) {
            this.momentumResetTween.kill();
        }

        this.momentumResetTween = gsap.to(this.sprite, {
            rotation: 0,
            duration: Math.abs(this.sprite.rotation),
        });
        this.sprite.rotation = value * scale;
        console.log(this.rotation);
    }
}

class Cauldron extends Container {
    ingredients: IngredientInfo[] = [];

    liquid: Sprite;
    constructor() {
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
        this.ingredients.push(info);

        const color = this.ingredients
            .map((i) => i.color)
            .reduceRight((prev, current) =>
                gsap.utils.interpolate(prev, current, 0.5),
            );

        gsap.to(this.liquid, { tint: color });
    }
}

// const flask = new Sprite(Texture.from(flaskImage));
// flask.anchor.set(0.5, 0.5);
// flask.eventMode = "static";
// flask.setParent(this);

// const pane = new Pane();

// const ctx = {
//     over: false,
//     drag: false,
//     x: 0,
//     y: 0,
// };

// pane.addBinding(ctx, "over");
// pane.addBinding(ctx, "drag");
// pane.addBinding(ctx, "x");
// pane.addBinding(ctx, "y");

// Ticker.shared.add(() => {
//     pane.refresh();
// });

// flask.on("pointerover", () => {
//     flask.tint = "#ff00ff";
//     ctx.over = true;
// });

// flask.on("pointerleave", () => {
//     flask.tint = "#00ff00";
//     ctx.over = false;
// });

// flask.on("pointerdown", () => {
//     console.log("pointerDown");
//     if (ctx.over) {
//         ctx.drag = true;
//     }

//     this.on("pointermove", onMove);

//     const drop = () => {
//         console.log("stopdrag");
//         ctx.drag = false;

//         flask.x = Math.max(
//             flask.width / 2,
//             Math.min(background.width - flask.width / 2, flask.x),
//         );
//         flask.y = Math.max(
//             flask.height / 2,
//             Math.min(background.height - flask.height / 2, flask.y),
//         );
//         // flask.y = Math.max(0, Math.min(background.height, flask.y));
//         this.off("pointermove", onMove);
//         flask.off("pointerup", drop);
//         flask.off("pointerupoutside", drop);
//     };
//     flask.once("pointerup", drop);
//     flask.once("pointerupoutside", drop);
// });

// const onMove = (ev: PointerEvent) => {
//     if (ctx.drag) {
//         ctx.x = ev.x;
//         ctx.y = ev.y;
//         flask.position.set(ctx.x, ctx.y);
//     }
// };
