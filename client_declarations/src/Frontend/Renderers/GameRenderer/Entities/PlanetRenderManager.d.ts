import { WorldCoords, Planet, Artifact, LocationId } from "@darkforest_eth/types";
import Renderer from "../Renderer";
import { PlanetRenderInfo } from "../../../../Backend/GameLogic/ViewportEntities";
/**
 * this guy is always going to call things in worldcoords, we'll convert them
 * to CanvasCoords. responsible for rendering planets by calling primitive renderers
 */
export default class PlanetRenderManager {
    renderer: Renderer;
    constructor(renderer: Renderer);
    queueLocation(planetInfo: PlanetRenderInfo, now: number, highPerfMode: boolean): void;
    queueArtifactsAroundPlanet(planet: Planet, artifacts: Artifact[], centerW: WorldCoords, radiusW: number, now: number, alpha: number): void;
    queueArtifactIcon(planet: Planet, { x, y }: WorldCoords, radius: number): void;
    queuePlanetSilverText(planet: Planet, center: WorldCoords, radius: number, alpha: number): void;
    getLockedEnergy(planet: Planet): number;
    getMouseAtk(): number | undefined;
    queueRings(planet: Planet, center: WorldCoords, radius: number): void;
    queuePlanetBody(planet: Planet, centerW: WorldCoords, radiusW: number): void;
    queueBlackDomain(planet: Planet, center: WorldCoords, radius: number): void;
    queueAsteroids(planet: Planet, center: WorldCoords, radius: number): void;
    queueHat(planet: Planet, center: WorldCoords, radius: number): void;
    queuePlanetEnergyText(planet: Planet, center: WorldCoords, radius: number, alpha: number): void;
    queuePlanets(cachedPlanets: Map<LocationId, PlanetRenderInfo>, now: number, highPerfMode: boolean): void;
    flush(): void;
}
