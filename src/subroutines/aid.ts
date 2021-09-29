import GameManager from "@df/GameManager";
import GameUIManager from "@df/GameUIManager";
declare const df: GameManager;
declare const ui: GameUIManager;

export default function aid(
  sourcePlanetLocationId,
  syncPlanetLocationId,
  percentageTrigger = 65,
  percentageSend = 20
) {
  const source = df
    .getAllOwnedPlanets()
    .filter((t) => t.locationId == sourcePlanetLocationId)[0];

  if (typeof source == "undefined") {
    return;
  }
  const unconfirmedDepartures = source.unconfirmedDepartures.reduce(
    (acc, dep) => {
      return acc + dep.forces;
    },
    0
  );
  const TRIGGER_AMOUNT = Math.floor(
    (source.energyCap * percentageTrigger) / 100
  );
  const FUZZY_ENERGY = Math.floor(source.energy - unconfirmedDepartures);
  const FORCES = Math.floor((source.energyCap * percentageSend) / 100);
  if (FUZZY_ENERGY > TRIGGER_AMOUNT) {
    console.log("[AID]: LAUNCHING AID FROM INTERVAL");
    df.terminal.current.println("[AID]: LAUNCHING AID FROM INTERVAL", 4);
    //send attack

    df.terminal.current.printShellLn(
      `df.move('${
        source.locationId
      }', '${syncPlanetLocationId}', ${FORCES}, ${0})`
    );
    df.move(sourcePlanetLocationId, syncPlanetLocationId, FORCES, 0);
  }
}
