import { findWeapons } from "../utils/planet";
import { createDelayedMove, createChainedMove } from "../subroutines";

import { secondsToMs } from "../utils/time";

export default function createOverload(
  srcId,
  targetId,
  levelLimit = 4,
  numOfPlanets = 5
) {
  //Change Find Weapons to go off of travel time instead of distance
  const weapons = findWeapons(srcId, levelLimit, numOfPlanets, 80, 2500);
  //Sort by who will take longest to land
  weapons.sort(
    (a, b) =>
      df.getTimeForMove(b.locationId, srcId) -
      df.getTimeForMove(a.locationId, srcId)
  );

  weapons.forEach((w) => {
    console.log(
      `${w.locationId} will arrive at`,
      new Date(
        new Date().getTime() +
          secondsToMs(df.getTimeForMove(w.locationId, srcId))
      )
    );
  });

  const ETA_MS =
    new Date().getTime() +
    secondsToMs(df.getTimeForMove(weapons[0].locationId, srcId)) +
    secondsToMs(10);
  console.log("Expected arrival of reinforcements", new Date(ETA_MS));
  //Add 10 seconds for processing
  const juice = weapons.map((p) => {
    return createDelayedMove(
      p.locationId,
      srcId,
      Math.floor(ETA_MS - secondsToMs(df.getTimeForMove(p.locationId, srcId)))
    );
  });
  const launch = createChainedMove(
    srcId,
    targetId,
    juice.map((a) => a.payload.srcId),
    ETA_MS + secondsToMs(3 * 60)
  );
  return [launch, ...juice];
}
