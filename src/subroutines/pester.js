// A recurring attack
import { checkNumInboundVoyages } from "../utils/planet";

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
  if (checkNumInboundVoyages(opponentsPlanetLocationsId) >= 7) {
    //Too many inbound
    return;
  }
  const TRIGGER_AMOUNT = Math.floor(
    (source.energyCap * percentageTrigger) / 100
  );
  const FUZZY_ENERGY = Math.floor(source.energy - unconfirmedDepartures);
  const FORCES = Math.floor((source.energyCap * percentageSend) / 100);

  if (FUZZY_ENERGY > TRIGGER_AMOUNT) {
    console.log("[PESTER]: LAUNCHING ATTACK FROM INTERVAL");
    terminal.println("[PESTER]: LAUNCHING ATTACK FROM INTERVAL", 4);

    //send attack
    terminal.jsShell(
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
) {
  return {
    id: `[PESTER]-${yourPlanetLocationId}-${opponentsPlanetLocationsId}-${percentageTrigger}-${percentageSend}`,
    type: this.c.PESTER,
    payload: {
      srcId,
      syncId,
      percentageTrigger,
      percentageSend,
    },
    meta,
  };
}
