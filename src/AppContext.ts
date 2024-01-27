import { Application } from "pixi.js";
import { Pane } from "tweakpane";

export class AppContext {
    public app: Application;
    public tweakpane = new Pane({ title: "Debug" });

    constructor(app: Application) {
        this.app = app;
    }
}
