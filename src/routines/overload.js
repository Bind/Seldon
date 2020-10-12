import { findWeapons } from "../utils/planet";
import { createDelayedMove } from "../subroutines/delayedMove";
import { secondsToMs } from "../utils/time";

export default function createOverload(
  srcId,
  targetId,
  levelLimit = 4,
  numOfPlanets = 5
) {
  const weapons = findWeapons(srcId, levelLimit, numOfPlanets, 80, 2000);
  //Sort by who will take longest to land
  weapons.sort(
    (a, b) =>
      df.getTimeForMove(b.locationId, srcId) -
      df.getTimeForMove(a.locationId, srcId)
  );

  const ETA_MS =
    new Date().getTime() +
    secondsToMs(df.getTimeForMove(weapons[0].locationId, srcId)) +
    secondsToMs(10);
  //Add 10 seconds for processing
  const juice = weapons.map((p) => {
    return createDelayedMove(
      p.locationId,
      srcId,
      Math.floor(ETA_MS - secondsToMs(df.getTimeForMove(p.locationId, srcId)))
    );
  });
  const launch = createDelayedMove(srcId, targetId, ETA_MS + secondsToMs(10));
  return [launch, ...juice];
}
