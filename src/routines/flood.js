import { findWeapons } from "../utils/planet.js";
import { createDelayedMove } from "../subroutines/delayedMove.js";
import { secondsToMs } from "../utils/time.js";
import { getEnergyArrival } from "../utils/planet.js";

export default function createFlood(
  locationId,
  levelLimit = 7,
  numOfPlanets = 5,
  searchRangeSec = 60 * 60,
  test = true
) {
  const weapons = findWeapons(
    locationId,
    levelLimit,
    numOfPlanets,
    80,
    searchRangeSec
  );
  //Sort by who will take longest to land

  weapons.sort(
    (a, b) =>
      df.getTimeForMove(b.locationId, locationId) -
      df.getTimeForMove(a.locationId, locationId)
  );
  const ETA_MS =
    new Date().getTime() +
    secondsToMs(df.getTimeForMove(weapons[0].locationId, locationId)) +
    secondsToMs(10);
  //Add 10 seconds for processing
  if (test == true) {
    const totalLandingEnergy = weapons.reduce(
      (acc, w) => acc + getEnergyArrival(w.locationId, locationId, 80),
      0
    );
    console.log(
      `all energy will land with ${totalLandingEnergy} at ${locationId}`
    );
    return [];
  }
  return weapons.map((p) => {
    return createDelayedMove(
      p.locationId,
      locationId,
      Math.floor(
        ETA_MS - secondsToMs(df.getTimeForMove(p.locationId, locationId))
      )
    );
  });
}
