import { df } from "./types/global";
import { LocationId, Planet } from "@darkforest_eth/types";

function distance(fromLoc, toLoc) {
  return Math.sqrt(
    (fromLoc.coords.x - toLoc.coords.x) ** 2 +
      (fromLoc.coords.y - toLoc.coords.y) ** 2
  );
}
function distanceSort(a, b) {
  return a[1] - b[1];
}

function isAsteroid(p) {
  return p.silverGrowth > 0;
}

export async function distributeSilver(
  fromId,
  maxDistributeEnergyPercent,
  minPlanetLevel = 4
) {
  const planet = df.getPlanetWithId(fromId);
  if (!planet) {
    return;
  }
  const candidates_ = df
    .getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter((p) => p.owner === df.getAccount())
    .filter((p) => p.planetLevel >= minPlanetLevel)
    .filter((p) => !isAsteroid(p))
    .map((to): [Planet, number] => {
      const fromLoc = df.getLocationOfPlanet(fromId);
      const toLoc = df.getLocationOfPlanet(to.locationId);
      return [to, distance(fromLoc, toLoc)];
    })
    .sort(distanceSort);

  let i = 0;
  const energyBudget = Math.floor(
    (maxDistributeEnergyPercent / 100) * planet.energy
  );
  const silverBudget = Math.floor(planet.silver);

  let energySpent = 0;
  let silverSpent = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {
    const silverLeft = silverBudget - silverSpent;
    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Check if has incoming moves from a previous asteroid to be safe
    const arrivals = await df.contractsAPI.coreContract.getArrivalsForPlanet(
      candidate.locationId
    );
    if (arrivals.length !== 0) {
      continue;
    }

    const silverRequested = Math.ceil(candidate.silverCap - candidate.silver);
    const silverNeeded =
      silverRequested > silverLeft ? silverLeft : silverRequested;

    // Setting a 100 silver guard here, but we could set this to 0
    if (silverNeeded < 100) {
      continue;
    }

    const energyNeeded = Math.ceil(
      df.getEnergyNeededForMove(fromId, candidate.locationId, 1)
    );
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    console.log(
      'df.move("' +
        fromId +
        '","' +
        candidate.locationId +
        '",' +
        energyNeeded +
        "," +
        silverNeeded +
        ")"
    );
    await df.move(fromId, candidate.locationId, energyNeeded, silverNeeded);
    energySpent += energyNeeded;
    silverSpent += silverNeeded;
  }
}
