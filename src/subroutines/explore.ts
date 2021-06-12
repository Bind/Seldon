import { df, Action, MoveType } from "../types/global";
import { LocationId, Planet } from "@darkforest_eth/types";
import {
  checkNumInboundVoyages,
  planetPercentEnergy,
  planetCurrentPercentEnergy,
  planetIsRevealed,
} from "../utils/planet.js";
import { default as c } from "../constants.js";

export interface Explore extends Action {
  payload: {
    srcId: LocationId;
    percentageRange: number;
    percentageSend: number;
    minLevel: number;
  };
}
export default function explore(
  srcId,
  percentageRange = 75,
  percentageSend = 25,
  minLevel = 3
) {
  const explorer = df.getPlanetWithId(srcId);
  if (!explorer) {
    return;
  }
  const takeable = df
    .getPlanetsInRange(srcId, percentageRange)
    .filter((p) => p.planetLevel >= minLevel)
    .filter((p) => p.owner == pirates)
    .filter((p) => planetIsRevealed(p.locationId))
    .filter((p) => checkNumInboundVoyages(p.locationId, explorer.owner) < 1)
    //Energy Needed to Take
    .filter(
      (p) =>
        df.getEnergyNeededForMove(srcId, p.locationId, planetPower(p)) <
        planetPercentEnergy(explorer, percentageSend)
    );
  takeable.sort((a, b) => b.planetLevel - a.planetLevel);
  if (takeable.length > 0) {
    console.log("[explore]: launching exploration");
    df.terminal.current.println("[explore]: launching exploration", 4);
    const target = takeable[0];
    const FORCES = Math.floor(
      df.getEnergyNeededForMove(
        srcId,
        target.locationId,
        planetPower(target) + 200
      )
    );

    //send attack
    df.terminal.current.printShellLn(
      `df.move('${explorer.locationId}', '${
        target.locationId
      }', ${FORCES}, ${0})`
    );
    df.move(explorer.locationId, target.locationId, FORCES, 0);
  } else if (planetCurrentPercentEnergy(explorer) > 75) {
    console.error(
      `[explore]: ${explorer.locationId} has not valid targets consider increasing percentageSend`
    );
    df.terminal.current.println(
      `[explore]: ${explorer.locationId} has not valid targets consider increasing percentageSend`,
      3
    );
  }
}

export function createExplore(
  srcId: LocationId,
  percentageRange: number = 75,
  percentageSend: number = 25,
  minLevel: number = 3
): Explore {
  return {
    id: `[EXPLORE]-${srcId}-${percentageRange}-${percentageSend}-${minLevel}`,
    type: MoveType.EXPLORE,
    payload: {
      srcId,
      percentageRange,
      percentageSend,
      minLevel,
    },
  };
}
