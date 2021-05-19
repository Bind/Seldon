function distance(fromLoc, toLoc) {
  return Math.sqrt(
    (fromLoc.coords.x - toLoc.coords.x) ** 2 +
      (fromLoc.coords.y - toLoc.coords.y) ** 2
  );
}
function distanceSort(a, b) {
  return a[1] - b[1];
}

export async function capturePlanets(
  fromId,
  minCaptureLevel,
  maxDistributeEnergyPercent,
  capturedMemo = []
) {
  //Ripped from Sophon

  const planet = df.getPlanetWithId(fromId);

  const candidates_ = df
    .getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter((p) => p.owner === "0x0000000000000000000000000000000000000000")
    .filter((p) => p.planetLevel >= minCaptureLevel)
    .map((to) => {
      const fromLoc = df.getLocationOfPlanet(fromId);
      const toLoc = df.getLocationOfPlanet(to.locationId);
      return [to, distance(fromLoc, toLoc)];
    })
    .sort(distanceSort);

  let i = 0;
  const energyBudget = Math.floor(
    (maxDistributeEnergyPercent / 100) * planet.energy
  );

  console.log("energyBudget ", energyBudget);

  let energySpent = 0;
  try {
    while (energyBudget - energySpent > 0 && i < candidates_.length) {
      const energyLeft = energyBudget - energySpent;

      // Remember its a tuple of candidates and their distance
      const candidate = candidates_[i++][0];

      // Check if has incoming moves from another planet to safe
      const arrivals = await df.contractsAPI.coreContract.getArrivalsForPlanet(
        candidate.locationId
      );
      if (arrivals.length !== 0) {
        continue;
      }

      const energyArriving = candidate.energyCap * 0.25;
      const energyNeeded = Math.ceil(
        df.getEnergyNeededForMove(fromId, candidate.locationId, energyArriving)
      );
      if (energyLeft - energyNeeded < 0) {
        continue;
      }
      if (capturedMemo.includes(candidate.locationId)) {
        continue;
      }

      console.log(
        `df.move("${fromId}","${candidate.locationId}",${energyNeeded},0)`
      );
      await df.move(fromId, candidate.locationId, energyNeeded, 0);
      capturedMemo.push(candidate.locationId);
      energySpent += energyNeeded;
    }
  } catch (err) {
    console.error(err);
  }

  return capturedMemo;
}
