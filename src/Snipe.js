// WIP
const pirates = "0x0000000000000000000000000000000000000000";
function getEnergyArrival(srcId, synId, percentageSend = 25) {
  const { energyCap } = df.getPlanetWithId(srcId);
  const payload = (energyCap * percentageSend) / 100;
  return df.getEnergyArrivingForMove(srcId, synId, payload);
}
function canCleanTake(explorer, planet) {}

function planetPower(planet) {
  return (planet.energy * planet.defense) / 100;
}
function planetPercentEnergy(planet, percentCap = 25) {
  const unconfirmedDepartures = planet.unconfirmedDepartures.reduce(
    (acc, dep) => {
      return acc + dep.forces;
    },
    0
  );
  const FUZZY_ENERGY = Math.floor(planet.energy - unconfirmedDepartures);
  return (FUZZY_ENERGY * percentCap) / 100;
}

function explore(
  ownPlanetId,
  percentageRange = 75,
  percentageSend = 25,
  minLevel = 3
) {
  const explorer = df.getPlanetWithId(ownPlanetId);
  const takable = df
    .getPlanetsInRange(ownPlanetId, percentageRange)
    .filter((p) => p.planetLevel < minLevel)
    .filter((p) => p.owner == pirates)
    //Energy Needed to Take
    .filter(
      (p) =>
        df.getEnergyNeededForMove(
          ownPlanetId,
          p.locationId,
          planetPower(p) + 200
        ) < planetPercentEnergy(explorer, percentageSend)
    );
  if (takable.length > 0) {
    console.log("[PESTER]: LAUNCHING ATTACK FROM INTERVAL");
    terminal.println("[PESTER]: LAUNCHING ATTACK FROM INTERVAL", 4);
    const target = takable[0];
    const FORCES = getEnergyNeededForMove(
      ownPlanetId,
      target.locationId,
      planetPower(target) + 200
    );

    //send attack
    terminal.jsShell(
      `df.move('${explorer.locationId}', '${
        target.locationId
      }', ${FORCES}, ${0})`
    );
    df.move(explorer.locationId, target.locationId, FORCES, 0);
  } else {
    console.error(
      `[EXPLORER]: ${explorer.id} has not valid targets consider increasing percentageSend`
    );
    terminal.println(
      `[EXPLORER]: ${explorer.id} has not valid targets consider increasing percentageSend`,
      3
    );
  }
}
