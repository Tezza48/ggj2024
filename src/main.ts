import { AppContext } from "./AppContext";
import { CauldronScene } from "./CauldronScene";
import "./style.css";
import { Application } from "pixi.js";

const root = document.querySelector<HTMLDivElement>("#app");

const application = new Application({ resizeTo: window, autoStart: true });
root?.appendChild(application.renderer.view as HTMLCanvasElement);

(globalThis as any)["__PIXI_APP__"] = application;

const appContext = new AppContext(application);

const scene = new CauldronScene(appContext);
application.stage.addChild(scene);
