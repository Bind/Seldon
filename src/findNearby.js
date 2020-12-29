let pirates = "0x0000000000000000000000000000000000000000";

function getDistance(a, b) {
  const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  return dist;
}

function getEnergyArrival(srcId, synId, percentageSend = 25) {
  const { energyCap } = df.getPlanetWithId(srcId);
  const payload = (energyCap * percentageSend) / 100;
  return df.getEnergyArrivingForMove(srcId, synId, payload);
}
function findNearBy(
  planetLocationId,
  maxDistance = 5000,
  levelLimit = 3,
  numOfPlanets = 5
) {
  const owned = df.getMyPlanets();

  const ownedFiltered = owned
    .filter((p) => p.planetLevel <= levelLimit)
    .filter(
      (p) => df.getDist(planetLocationId),
      df.getDist(p.locationId) < maxDistance
    );
  ownedFiltered.sort(
    (a, b) =>
      df.getDist(planetLocationId, a.locationId) -
      df.getDist(planetLocationId, b.locationId)
  );
  const mapped = ownedFiltered.map((p) => {
    const landingForces = getEnergyArrival(p.locationId, planetLocationId);
    console.log(landingForces);
    return {
      landingForces,
      planet: p,
    };
  });

  mapped.sort((a, b) => {
    return b.landingForces - a.landingForces;
  });
  return mapped.slice(0, numOfPlanets);
}
