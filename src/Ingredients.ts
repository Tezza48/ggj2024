import gsap from "gsap";
import { Texture } from "pixi.js";

export const Ingredients = {
    lime: {
        texture: Texture.from("./assets/fruits/lime.png"),
        color: "#00ff00",
        description: "Lime",
        satisfies: ["sour", "green"],
    },
    blueberry: {
        texture: Texture.from("./assets/fruits/black_cherry.png"),
        color: "#4327e4",
        description: "Blueberry",
        satisfies: ["sweet", "sour", "blue"],
    },
    lemon: {
        texture: Texture.from("./assets/fruits/lemon.png"),
        color: "#e1ec77",
        description: "Lemon",
        satisfies: ["sour", "yellow"],
    },
    chocolate: {
        texture: Texture.from("./assets/chocolate.png"),
        color: "#614229",
        description: "Chocolate",
        satisfies: ["sweet", "cosy"],
    },
    orange: {
        texture: Texture.from("./assets/fruits/orange.png"),
        color: "#ffae00",
        description: "Orange",
        satisfies: ["sweet", "orange"],
    },
    banana: {
        texture: Texture.from("./assets/fruits/banana.png"),
        color: "#eeff00",
        description: "Banana",
        satisfies: ["sweet", "yellow"],
    },
    cuddle: {
        texture: Texture.from("./assets/teddy.png"),
        color: "#d63975",
        description: "Cuddle",
        satisfies: ["cosy", "pink"],
    },
    // lake: {
    //     color: "#00e1ff",
    //     description: "Lake",
    //     satisfies: ["blue", "shiny", "cold"],
    // },
    // goth: {
    //     color: "#1e1e1e",
    //     description: "Goth",
    //     satisfies: ["black", "pink"],
    // },
    // bubble: {
    //     color: "#ffffff",
    //     description: "Bubble",
    //     satisfies: ["fizz"],
    // },
    // pepper: {
    //     color: "#ff00ff",
    //     description: "Pepper",
    //     satisfies: ["hot", "red"],
    // },
    liquorice: {
        texture: Texture.from("./assets/liquorice.png"),
        color: "#000000",
        description: "Liquorice",
        satisfies: ["black", "sweet"],
    },
    glitter: {
        texture: Texture.from("./assets/glitter.png"),
        color: "#b4e4ec",
        description: "Glitter",
        satisfies: ["shiny"],
    },

    empty: {
        texture: Texture.EMPTY,
        color: "#4d554d",
        description: "Empty",
        satisfies: [],
    },
} as Record<string, IngredientInfo>;

export function mixIngredientColors(ingredients: IngredientInfo[]) {
    const [r, g, b] = ingredients
        .map((i) => i.color)
        .map((c) => gsap.utils.splitColor(c, false) as [number, number, number])
        .reduceRight(
            ([pr, pg, pb], [cr, cg, cb]) =>
                [pr + cr, pg + cg, pb + cb] as const,
        )
        .map((c) => c / ingredients.length);

    return `rgb(${r}, ${g}, ${b})`;
}

export const Needs = {
    sweet: { description: "Sweet" },
    sour: { description: "Sour" },
    fizz: { description: "Fizz" },
    drama: { description: "Drama" },
    cosy: { description: "Cute" },
    hot: { description: "Hot" },
    cold: { description: "Cold" },
    shiny: { description: "Shiny" },
    red: { description: "Red" },
    orange: { description: "Orange" },
    yellow: { description: "Yellow" },
    green: { description: "Green" },
    blue: { description: "Blue" },
    pink: { description: "Pink" },
    purple: { description: "Purple" },
    black: { description: "Black" },
    white: { description: "White" },
} satisfies Record<string, NeedInfo>;

export type IngredientInfo = {
    texture: Texture;
    color: string;
    description: string;
    satisfies: NeedName[];
};

export type NeedInfo = { description: string };

// export type IngredientName = keyof typeof Ingredients;
export type NeedName = keyof typeof Needs;
