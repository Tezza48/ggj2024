import { IngredientInfo } from "./Ingredients";

export type IngredientDragEvent = {
    info: IngredientInfo;
    pointerEvent: PointerEvent;
};

export type PotionDragEvent = {
    ingredients: IngredientInfo[];
    pointerEvent: PointerEvent;
};
