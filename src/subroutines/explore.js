import {
  checkNumInboundVoyages,
  planetPercentEnergy,
  planetCurrentPercentEnergy,
  planetIsRevealed,
} from "../utils/planet";
import { default as c } from "../constants";
export default function explore(
  srcId,
  percentageRange = 75,
  percentageSend = 25,
  minLevel = 3
) {
  const explorer = df.getPlanetWithId(srcId);
  const takeable = df
    .getPlanetsInRange(srcId, percentageRange)
    .filter((p) => p.planetLevel >= minLevel)
    .filter((p) => p.owner == pirates)
    .filter((p) => planetIsRevealed(p.locationId))
    .filter((p) => checkNumInboundVoyages(p.planetId, explorer.owner) < 1)
    //Energy Needed to Take
    .filter(
      (p) =>
        df.getEnergyNeededForMove(srcId, p.locationId, planetPower(p)) <
        planetPercentEnergy(explorer, percentageSend)
    );
  takeable.sort((a, b) => b.planetLevel - a.planetLevel);
  if (takeable.length > 0) {
    console.log("[explore]: launching exploration");
    terminal.println("[explore]: launching exploration", 4);
    const target = takeable[0];
    const FORCES = Math.floor(
      df.getEnergyNeededForMove(
        srcId,
        target.locationId,
        planetPower(target) + 200
      )
    );

    //send attack
    terminal.jsShell(
      `df.move('${explorer.locationId}', '${
        target.locationId
      }', ${FORCES}, ${0})`
    );
    df.move(explorer.locationId, target.locationId, FORCES, 0);
  } else if (planetCurrentPercentEnergy(explorer) > 75) {
    console.error(
      `[explore]: ${explorer.id} has not valid targets consider increasing percentageSend`
    );
    terminal.println(
      `[explore]: ${explorer.id} has not valid targets consider increasing percentageSend`,
      3
    );
  }
}

export function createExplore(
  srcId,
  percentageRange = 75,
  percentageSend = 25,
  minLevel = 3
) {
  return {
    id: `[EXPLORE]-${srcId}-${percentageRange}-${percentageSend}-${minLevel}`,
    type: c.EXPLORE,
    payload: {
      srcId,
      percentageRange,
      percentageSend,
      minLevel,
    },
  };
}
