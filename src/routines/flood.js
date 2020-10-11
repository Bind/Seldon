import { findWeapons } from "../utils/planet";
import { createDelayedMove } from "../subroutines/delayedMove";
import { secondsToMs } from "../utils/time";

export default function createFlood(
  locationId,
  levelLimit = 7,
  numOfPlanets = 5
) {
  const weapons = findWeapons(locationId, levelLimit, numOfPlanets, 80, 5000);
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
