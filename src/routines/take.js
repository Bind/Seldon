import { findWeapons, modelEnergyNeededToTake } from "../utils/planet";
import { createDelayedMove, createChainedMove } from "../subroutines";

import { secondsToMs, msToSeconds } from "../utils/time";

export default function createTake(targetId, depthOfSearch = 3) {
  //Change Find Weapons to go off of travel time instead of distance
  const myPlanets = df.getMyPlanets().map((p) => {
    return {
      ...p,
      energyNeededToTake: modelEnergyNeededToTake(p.locationId, targetId),
    };
  });

  const exclude = [];
  myPlanets.sort(
    (a, b) => a.modelEnergyNeededToTake - b.modelEnergyNeededToTake
  ); //Get least

  const launch_planet = myPlanets[0];
  exclude.push(launch_planet.locationId);
  // Run variation of knapsack algo

  // Todo: changed ChainedMove to either store a time to start check if passengers have arrived or...
  // instead of too_early period, on each coreLoop check arrivals and use action as Memo,
  /// don't start doing the arrival check until if you've seen all expected planets in the arrivals array at least once

  // const weapons = findWeapons(targetId, 7, 6, 80, searchRangeSec);
  // if (weapons.length == 0) {
  //   //No valid weapons
  //   return;
  // }
  // //Sort by who will take longest to land
  // weapons.sort(
  //   (a, b) =>
  //     df.getTimeForMove(b.locationId, srcId) -
  //     df.getTimeForMove(a.locationId, srcId)
  // );
  // const now = new Date().getTime();

  // const ETA_MS =
  //   now +
  //   secondsToMs(df.getTimeForMove(weapons[0].locationId, srcId)) +
  //   secondsToMs(10);
  // console.timeLog(`${ETA_MS - now}`);
  // const juice = weapons.map((p) => {
  //   console.log(
  //     `[OVERLOAD]: incoming charge from ${
  //       p.locationId
  //     } scheduled in ${msToSeconds(
  //       Math.floor(
  //         ETA_MS - now + secondsToMs(df.getTimeForMove(p.locationId, srcId))
  //       )
  //     )}s`
  //   );

  //   return createDelayedMove(
  //     p.locationId,
  //     srcId,
  //     Math.floor(ETA_MS - secondsToMs(df.getTimeForMove(p.locationId, srcId)))
  //   );
  // });
  // console.log(
  //   `[OVERLOAD]:  discharge scheduled in ${new Date(
  //     ETA_MS + secondsToMs(3 * 60)
  //   )} `
  // );
  // const launch = createChainedMove(
  //   srcId,
  //   targetId,
  //   juice.map((a) => a.payload.srcId),
  //   ETA_MS + secondsToMs(3 * 60)
  // );
  // return [launch, ...juice];
  console.log("not implemented");
}
