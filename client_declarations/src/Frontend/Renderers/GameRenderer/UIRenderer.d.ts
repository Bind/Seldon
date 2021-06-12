import { Planet, WorldCoords } from "@darkforest_eth/types";
import Renderer from "./Renderer";
import { RGBVec } from "./EngineTypes";
export declare class UIRenderer {
    renderer: Renderer;
    constructor(renderer: Renderer);
    queueBorders(): void;
    queueMousePath(): void;
    queueRectAtPlanet(planet: Planet, coords: WorldCoords, color: RGBVec): void;
    queueSelectedRect(): void;
    queueHoveringRect(): void;
    drawMiner(): void;
    queueSelectedRangeRing(): void;
}
