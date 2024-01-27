import { Application } from "pixi.js";

export class AppContext {
    public app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
