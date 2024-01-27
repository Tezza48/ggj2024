import gsap from "gsap";

export const Ingredients = {
    lime: {
        color: "#00ff00",
        description: "Lime",
        satisfies: ["sour", "green"],
    },
    blueberry: {
        color: "#4327e4",
        description: "Blueberry",
        satisfies: ["sweet", "sour", "blue"],
    },
    lemon: {
        color: "#e1ec77",
        description: "Lemon",
        satisfies: ["sour", "yellow"],
    },
    chocolate: {
        color: "#614229",
        description: "Chocolate",
        satisfies: ["sweet", "cosy"],
    },
    orange: {
        color: "#ffae00",
        description: "Orange",
        satisfies: ["sweet", "orange"],
    },
    banana: {
        color: "#eeff00",
        description: "Banana",
        satisfies: ["sweet", "yellow"],
    },
    cuddle: {
        color: "#d63975",
        description: "Cuddle",
        satisfies: ["cosy", "pink"],
    },
    lake: {
        color: "#00e1ff",
        description: "Lake",
        satisfies: ["blue", "shiny", "cold"],
    },
    goth: {
        color: "#1e1e1e",
        description: "Goth",
        satisfies: ["black", "pink"],
    },
    bubble: {
        color: "#ffffff",
        description: "Bubble",
        satisfies: ["fizz"],
    },
    pepper: {
        color: "#ff00ff",
        description: "Pepper",
        satisfies: ["hot", "red"],
    },
    liquorice: {
        color: "#000000",
        description: "Liquorice",
        satisfies: ["black", "sweet"],
    },
    glitter: {
        color: "#b4e4ec",
        description: "Glitter",
        satisfies: ["shiny", "fizz"],
    },

    empty: {
        color: "#4d554d",
        description: "Empty",
        satisfies: [],
    },
} satisfies Record<string, IngredientInfo>;

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
    cosy: { description: "Cosy" },
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
    color: string;
    description: string;
    satisfies: NeedName[];
};

export type NeedInfo = { description: string };

// export type IngredientName = keyof typeof Ingredients;
export type NeedName = keyof typeof Needs;
