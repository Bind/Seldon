import { LocationId } from "@darkforest_eth/types";
import Renderer from "../Renderer";
import { QueuedArrival } from "@darkforest_eth/types";
export default class VoyageRenderer {
    renderer: Renderer;
    constructor(renderer: Renderer);
    drawFleet(voyage: QueuedArrival): void;
    queueVoyages(): void;
    drawVoyagePath(from: LocationId, to: LocationId, confirmed: boolean, isMyVoyage: boolean): void;
}
