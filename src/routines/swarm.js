import { findNearBy } from "../utils/planet";
import { createPester } from "../subroutines/pester";

export default function createSwarm(
  planetId,
  maxDistance = 5000,
  levelLimit = 5,
  numOfPlanets = 5
) {
  const nearby = findNearBy(planetId, maxDistance, levelLimit, numOfPlanets);
  nearby.map((p) => {
    return createPester(p.planet.locationId, planetId, 75, 40, {
      tag: "SWARM",
    });
  });
}
