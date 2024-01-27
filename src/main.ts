import gsap from "gsap";
import { AppContext } from "./AppContext";
import { Scene } from "./Scene";
import "./style.css";
import { Application } from "pixi.js";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/all";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const root = document.querySelector<HTMLDivElement>("#app");

const application = new Application({ resizeTo: window, autoStart: true });
root?.appendChild(application.renderer.view as HTMLCanvasElement);

(globalThis as any)["__PIXI_APP__"] = application;

const appContext = new AppContext(application);

const scene = new Scene(appContext);
application.stage.addChild(scene);
