// A recurring attack
import { df, MoveType, Action } from "../types/global";
import { LocationId } from "@darkforest_eth/types";
import {
  checkNumInboundVoyages,
  planetCurrentPercentEnergy,
} from "../utils/planet.js";
import { default as c } from "../constants.js";

export interface Pester extends Action {
  type: MoveType.PESTER;
  payload: {
    srcId: LocationId;
    syncId: LocationId;
    percentageTrigger: number;
    percentageSend: number;
  };
}

export default function pester(
  yourPlanetLocationId,
  opponentsPlanetLocationsId,
  percentageTrigger = 65,
  percentageSend = 20
) {
  const match = df
    .getMyPlanets()
    .filter((t) => t.locationId == yourPlanetLocationId);
  if (match.length == 0) {
    return;
  }
  const source = match[0];
  const unconfirmedDepartures = source.unconfirmedDepartures.reduce(
    (acc, dep) => {
      return acc + dep.forces;
    },
    0
  );
  if (checkNumInboundVoyages(opponentsPlanetLocationsId) >= 6) {
    //Too many inbound
    return;
  }
  const TRIGGER_AMOUNT = Math.floor(
    (source.energyCap * percentageTrigger) / 100
  );
  const FUZZY_ENERGY = Math.floor(source.energy - unconfirmedDepartures);

  if (FUZZY_ENERGY > TRIGGER_AMOUNT) {
    //If significantly over the trigger amount just batch include excess energy in the attack
    // If current energy is 90% instead of sending 20% and landing at 70%, send 45% then recover;

    const overflow_send =
      planetCurrentPercentEnergy(source) - (percentageTrigger - percentageSend);

    const FORCES = Math.floor((source.energyCap * overflow_send) / 100);
    console.log(`[pester]: launching attack from ${source.locationId}`);
    df.terminal.current.println(
      `[pester]: launching attack from ${source.locationId}`,
      4
    );

    //send attack
    df.terminal.current.printShellLn(
      `df.move('${
        source.locationId
      }', '${opponentsPlanetLocationsId}', ${FORCES}, ${0})`
    );
    df.move(yourPlanetLocationId, opponentsPlanetLocationsId, FORCES, 0);
  }
}

export function createPester(
  srcId,
  syncId,
  percentageTrigger = 75,
  percentageSend = 45,
  meta = {}
): Pester {
  return {
    id: `[PESTER]-${srcId}-${syncId}-${percentageTrigger}-${percentageSend}`,
    type: MoveType.PESTER,
    payload: {
      srcId,
      syncId,
      percentageTrigger,
      percentageSend,
    },
    meta,
  };
}
