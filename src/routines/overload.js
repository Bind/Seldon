import { findWeapons } from "../utils/planet";
import { createDelayedMove, createChainedMove } from "../subroutines";

import { secondsToMs, msToSeconds } from "../utils/time";

function customLogger() {
  return {
    RAN: "",
    DELAYED: "",
    FORCED: "",
  };
}

export default function createOverload(
  srcId,
  targetId,
  searchRangeSec = 30 * 60,
  levelLimit = 4,
  numOfPlanets = 5
) {
  //Change Find Weapons to go off of travel time instead of distance
  const weapons = findWeapons(
    srcId,
    levelLimit,
    numOfPlanets,
    80,
    searchRangeSec
  );
  //Sort by who will take longest to land
  weapons.sort(
    (a, b) =>
      df.getTimeForMove(b.locationId, srcId) -
      df.getTimeForMove(a.locationId, srcId)
  );
  const now = new Date().getTime();
  const ETA_MS =
    now +
    secondsToMs(df.getTimeForMove(weapons[0].locationId, srcId)) +
    secondsToMs(10);
  console.timeLog(`${ETA_MS - now}`);
  const juice = weapons.map((p) => {
    console.log(
      `[OVERLOAD]: charge scheduled in  ${msToSeconds(
        Math.floor(
          ETA_MS - now + secondsToMs(df.getTimeForMove(p.locationId, srcId))
        )
      )}s`
    );

    return createDelayedMove(
      p.locationId,
      srcId,
      Math.floor(ETA_MS - secondsToMs(df.getTimeForMove(p.locationId, srcId)))
    );
  });
  console.log(
    `[OVERLOAD]:  discharge scheduled in ${new Date(
      ETA_MS + secondsToMs(3 * 60)
    )} `
  );
  const launch = createChainedMove(
    srcId,
    targetId,
    juice.map((a) => a.payload.srcId),
    ETA_MS + secondsToMs(3 * 60)
  );
  return [launch, ...juice];
}
