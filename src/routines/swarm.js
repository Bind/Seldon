import { findNearBy } from "../utils/planet.js";
import { createPester } from "../subroutines/pester.js";

export default function createSwarm(
  planetId,
  maxDistance = 5000,
  levelLimit = 1,
  numOfPlanets = 5
) {
  const nearby = findNearBy(planetId, maxDistance, levelLimit, numOfPlanets);
  return nearby.map((p) => {
    return createPester(p.planet.locationId, planetId, 75, 40, {
      tag: "SWARM",
    });
  });
}
