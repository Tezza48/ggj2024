import { Texture } from "pixi.js";
import { Ingredients, NeedName } from "./Ingredients";

const all = [
    "./assets/portraits/portrait_1.png",
    "./assets/portraits/portrait_2.png",
    "./assets/portraits/portrait_3.png",
    "./assets/portraits/portrait_5.png",
];

export const Characters = [
    {
        texture: Texture.from("./assets/portraits/portrait_1.png"),
        needs: ["sweet"],
    },
    // {
    //     texture: Texture.from("./assets/portraits/portrait_2.png"),
    //     needs: ["sour"],
    // },
    // {
    //     texture: Texture.from("./assets/portraits/portrait_3.png"),
    //     needs: ["black", "cosy"],
    // },
    // {
    //     texture: Texture.from("./assets/portraits/portrait_5.png"),
    //     needs: ["yellow", "blue"],
    // },
    () => ({
        texture: Texture.from(
            all[Math.floor(Math.random() * (all.length - 1))],
        ),
        needs: Array.from(
            new Set(
                Object.values(Ingredients)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map((i) => i.satisfies)
                    .reduce((prev, curr) => [...prev, ...curr], [])
                    .sort(() => Math.random() - 0.5),
            ),
        ).slice(0, 3),
    }),
] satisfies (Character | (() => Character))[];

export type Character = { texture: Texture; needs: NeedName[] };
