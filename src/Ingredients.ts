export const Ingredients = {
    lime: {
        color: "#00ff00",
        description: "",
        satisfies: ["sour", "green"],
    },
    blueberry: {
        color: "#4327e4",
        description: "Blueberry",
        satisfies: ["sweet", "sour", "blue"],
    },
    lemon: {
        color: "#e1ec77",
        description: "",
        satisfies: ["sour", "yellow"],
    },
    chocolate: {
        color: "#614229",
        description: "",
        satisfies: ["sweet", "cosy"],
    },
    orange: {
        color: "#ffae00",
        description: "",
        satisfies: ["sweet", "orange"],
    },
    banana: {
        color: "#eeff00",
        description: "",
        satisfies: ["sweet", "yellow"],
    },
    cuddle: {
        color: "#d63975",
        description: "Cuddle",
        satisfies: ["cosy"],
    },
    lake: {
        color: "#00e1ff",
        description: "Lake",
        satisfies: ["blue", "shiny"],
    },
} satisfies Record<string, IngredientInfo>;

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
