import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { AppContext } from "./AppContext";
import { IngredientInfo, NeedName, Needs } from "./Ingredients";
import gsap from "gsap";
import { Character, Characters } from "./Characters";

export class CustomerPane extends Container {
    private background: Sprite;
    private countertop: Sprite;
    private thoughtBubble: Sprite;
    public customer: Customer;
    public thought: Text;

    private maskGfx: Graphics;

    private currentCustomer: number;

    constructor(public appContext: AppContext) {
        super();

        this.currentCustomer = 0;

        this.background = new Sprite(Texture.WHITE);
        this.background.tint = "#4a5e46";
        this.background.setParent(this);

        this.customer = new Customer();
        this.customer.setCharacter(
            typeof Characters[0] === "function"
                ? Characters[0]()
                : Characters[0],
        );
        this.customer.setParent(this);

        this.thoughtBubble = new Sprite(
            Texture.from("./assets/thought_bubble.png"),
        );
        this.thoughtBubble.setParent(this);
        this.thoughtBubble.anchor.set(0.5, 0.3);

        // const bubble = new Sprite(Texture.WHITE);
        // bubble.alpha = 0.8;
        // bubble.width = 300;
        // bubble.height = 200;
        // bubble.anchor.set(0.5);
        // bubble.setParent(this.thoughtBubble);

        this.thought = new Text(
            `I need...\n${this.customer.needs
                .map((n) => Needs[n].description)
                .join("\n")}`,
        );
        this.thought.setParent(this.thoughtBubble);
        this.thought.anchor.set(0.5);

        this.countertop = new Sprite(Texture.from("./assets/wood.png"));
        this.countertop.tint = "#8f795f";
        this.countertop.setParent(this);

        this.maskGfx = new Graphics();
        this.maskGfx.setParent(this);
        this.mask = this.maskGfx;

        this.layout();
    }

    public set width(value: number) {
        this.background.width = value;
        this.layout();
    }

    public set height(value: number) {
        this.background.height = value;
        this.layout();
    }

    public getNewCustomer() {
        gsap.timeline()
            .to(this.thoughtBubble, {
                pixi: { alpha: 0, scale: 0.3 },
                duration: 0.3,
            })
            .to(this.customer, {
                pixi: {
                    x: this.customer.position.x + 500,
                },
                duration: 1,
            })
            .add(() => {
                this.currentCustomer = Math.min(
                    this.currentCustomer + 1,
                    Characters.length - 1,
                );
                const character = Characters[this.currentCustomer];
                this.customer.setCharacter(
                    typeof character === "function" ? character() : character,
                );
                this.thought.text = `I need...\n${this.customer.needs
                    .map((n) => Needs[n].description)
                    .join("\n")}`;
            })
            .set(this.customer, {
                pixi: {
                    x: this.background.width / 2 - 500,
                },
                duration: 1,
            })
            .to(this.customer, {
                pixi: {
                    x: this.background.width / 2,
                },
            })
            .to(this.thoughtBubble, {
                pixi: {
                    alpha: 1,
                    scale: 1,
                },
            });
    }

    private layout() {
        this.maskGfx.clear();
        this.maskGfx.beginFill();
        this.maskGfx.drawRect(
            0,
            0,
            this.appContext.app.view.width / 3,
            this.appContext.app.view.height,
        );

        this.background.width = this.appContext.app.view.width / 3;
        this.background.height = this.appContext.app.view.height;

        this.countertop.width = this.background.width;
        this.countertop.height = this.background.height / 3;
        this.countertop.y = (2 * this.background.height) / 3;

        this.customer.x = this.background.width / 2;
        this.customer.y = (2 * this.background.height) / 3;

        this.thoughtBubble.position.set(
            this.background.width / 2,
            this.background.height / 6 - 50,
        );
    }
}

class Customer extends Container {
    public needs: NeedName[] = [];
    private sprite: Sprite;
    constructor() {
        super();

        this.sprite = new Sprite();
        this.sprite.setParent(this);
        this.sprite.anchor.set(0.5, 1);

        // const torso = new Sprite(Texture.WHITE);
        // torso.name = "torso";
        // torso.setParent(this);
        // torso.anchor.set(0.5, 1);
        // torso.tint = "#2e2e2e";
        // torso.width = 250;
        // torso.height = 150;

        // const head = new Sprite(Texture.WHITE);
        // head.name = "head";
        // head.setParent(this);
        // head.width = 100;
        // head.height = 130;
        // head.tint = torso.tint;
        // head.anchor.set(0.5, 1);
        // head.y = -torso.height;
    }

    setCharacter(character: Character) {
        this.sprite.texture = character.texture;
        this.sprite.width = 300;
        this.sprite.height = 300;
        this.sprite.scale.set(this.sprite.scale.x);
        this.needs = character.needs;
    }

    givePotion(ingredients: IngredientInfo[]): boolean {
        const satisfaction = Object.fromEntries(
            this.needs.map((need) => [need, false]),
        ) as Record<NeedName, boolean>;

        const allSatisfies = new Set(
            ingredients
                .map((i) => i.satisfies)
                .reduceRight((prev, curr) => [...prev, ...curr]),
        );

        for (const satisfies of allSatisfies) {
            if (satisfaction[satisfies] === false)
                satisfaction[satisfies] = true;
        }
        // for (const ingredient of ingredients) {
        //     for (const satisfies of ingredient.satisfies) {
        //         if (satisfaction[satisfies] === false)
        //             satisfaction[satisfies] = true;
        //     }
        // }

        if (this.needs.includes("purple")) {
            if (
                ingredients.find((i) => i.satisfies.includes("red")) &&
                ingredients.find((i) => i.satisfies.includes("blue"))
            ) {
                satisfaction["purple"] = true;
            }
        }

        const isSuccess = Object.values(satisfaction).reduce(
            (prev, curr) => prev && curr,
            true,
        );
        return isSuccess;
    }
}
