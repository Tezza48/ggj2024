import { Container, Sprite, Text, Texture } from "pixi.js";
import { AppContext } from "./AppContext";
import { NeedInfo, Needs } from "./Ingredients";

export class CustomerPane extends Container {
    private background: Sprite;
    private countertop: Sprite;
    private thoughtBubble: Container;
    private customer: Customer;

    constructor(public appContext: AppContext) {
        super();
        this.background = new Sprite(Texture.WHITE);
        this.background.tint = "#4a5e46";
        this.background.setParent(this);

        this.customer = new Customer([Needs.green, Needs.sweet, Needs.sour]);
        this.customer.setParent(this);

        this.thoughtBubble = new Container();
        this.thoughtBubble.setParent(this);

        const bubble = new Sprite(Texture.WHITE);
        bubble.alpha = 0.8;
        bubble.width = 300;
        bubble.height = 200;
        bubble.anchor.set(0.5);
        bubble.setParent(this.thoughtBubble);

        const thought = new Text(
            this.customer.needs.map((n) => n.description).join("\n"),
        );
        thought.setParent(this.thoughtBubble);
        thought.anchor.set(0.5);

        this.countertop = new Sprite(Texture.WHITE);
        this.countertop.tint = "#8f795f";
        this.countertop.setParent(this);

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

    private layout() {
        this.countertop.width = this.background.width;
        this.countertop.height = this.background.height / 3;
        this.countertop.y = (2 * this.background.height) / 3;

        this.customer.x = this.background.width / 2;
        this.customer.y = (2 * this.background.height) / 3;

        this.thoughtBubble.position.set(
            this.background.width / 2,
            this.background.height / 6,
        );
    }
}

class Customer extends Container {
    constructor(public needs: NeedInfo[]) {
        super();

        const torso = new Sprite(Texture.WHITE);
        torso.name = "torso";
        torso.setParent(this);
        torso.anchor.set(0.5, 1);
        torso.tint = "#2e2e2e";
        torso.width = 250;
        torso.height = 150;

        const head = new Sprite(Texture.WHITE);
        head.name = "head";
        head.setParent(this);
        head.width = 100;
        head.height = 130;
        head.tint = torso.tint;
        head.anchor.set(0.5, 1);
        head.y = -torso.height;
    }
}
