import { LocationId, WorldLocation } from "@darkforest_eth/types";
import { QuadTree } from "js-quadtree";
import { Radii } from "./ViewportEntities";
/**
 * Data structure which allows us to efficiently query for "which planets between level X and X + n
 * (for positive n) are present in the given world rectangle", as well as, in the future, "which
 * chunks are visible in the vieport".
 */
export declare class LayeredMap {
    perLevelPlanetQuadtrees: Map<number, QuadTree>;
    insertedLocations: Set<LocationId>;
    constructor(worldRadius: number);
    /**
     * Records the fact that there is a planet at the given world location.
     */
    insertPlanet(location: WorldLocation, planetLevel: number): void;
    /**
     * Gets the ids of all the planets that are both within the given bounding box (defined by its bottom
     * left coordinate, width, and height) in the world and of a level that was passed in via the
     * `planetLevels` parameter.
     */
    getPlanets(worldX: number, worldY: number, worldWidth: number, worldHeight: number, planetLevels: number[], planetLevelToRadii: Map<number, Radii>): LocationId[];
}
