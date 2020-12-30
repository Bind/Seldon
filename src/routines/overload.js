import { findWeapons } from "../utils/planet.js";
import { createDelayedMove, createChainedMove } from "../subroutines";

import { secondsToMs, msToSeconds } from "../utils/time.js";
import { getEnergyArrivalAbs, getEnergyArrival } from "../utils/planet.js";

export default function createOverload(
  srcId,
  targetId,
  searchRangeSec = 30 * 60,
  levelLimit = 7,
  numOfPlanets = 5,
  test = false
) {
  //Change Find Weapons to go off of travel time instead of distance
  const weapons = findWeapons(
    srcId,
    levelLimit,
    numOfPlanets,
    80,
    searchRangeSec
  );
  if (weapons.length == 0) {
    //No valid weapons
    return;
  }
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
  const juice = weapons.map((p) => {
    console.log(
      `[overload]: incoming charge from ${
        p.locationId
      } scheduled in ${msToSeconds(
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
    `[overload]:  discharge scheduled in ${new Date(
      ETA_MS + secondsToMs(3 * 60)
    )} `
  );
  if (test) {
    const addedEnergy = juice.reduce(
      (acc, a) => acc + getEnergyArrival(a.payload.srcId, srcId, 75),
      0
    );
    console.log(
      `OVERLOAD TEST: Expect at Minimum ${getEnergyArrivalAbs(
        srcId,
        targetId,
        addedEnergy
      )}`
    );
    return [];
  }
  const launch = createChainedMove(
    srcId,
    targetId,
    juice.map((a) => a.payload.srcId),
    ETA_MS + secondsToMs(3 * 60)
  );
  return [launch, ...juice];
}
