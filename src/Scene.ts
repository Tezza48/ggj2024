import { Container, Point, Sprite, Texture } from "pixi.js";
import { AppContext } from "./AppContext";

import { Ingredients } from "./Ingredients";
import { CustomerPane } from "./CustomerPane";
import { SourceIngredient } from "./SourceIngredient";
import { DraggedIngredient } from "./DraggedIngredient";
import { Cauldron } from "./Cauldron";
import { DraggedPotion } from "./DraggedPotion";
import { PotionDragEvent, IngredientDragEvent } from "./DragEvent";

export class Scene extends Container {
    constructor(appContext: AppContext) {
        super();

        this.eventMode = "static";

        const mainContainer = new Container();
        mainContainer.setParent(this);
        mainContainer.x = appContext.app.view.width / 3;

        const background = new Sprite(Texture.from("./assets/granite.png"));
        background.tint = "#ffffff";
        background.height = appContext.app.view.height;
        background.scale.x = background.scale.x;
        background.setParent(mainContainer);
        background.name = "background";

        const cauldronPos = new Point(
            appContext.app.view.width / 3,
            background.height / 2 - 100,
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
        let wrap = 8;
        for (const [name, info] of Object.entries(Ingredients)) {
            if (info == Ingredients.empty) continue;

            const ingredient = new SourceIngredient(info);
            console.log(name);
            ingredient.name = name;
            ingredient.position.set(
                (i % wrap) * ingredient.width,
                ingredient.height / 2 +
                    Math.floor(i / wrap) * ingredient.height +
                    5,
            );
            ingredient.setParent(ingredientContainer);

            ingredient.on("startdragging", onDragIngredient);
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
