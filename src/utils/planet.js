export function checkNumInboundVoyages(planetId, from = "") {
  if (from == "") {
    return (
      df.getAllVoyages().filter((v) => v.planetId == planetId).length +
      df.getUnconfirmedMoves().filter((m) => m.to == planetId).length
    );
  } else {
    return (
      df
        .getAllVoyages()
        .filter((v) => v.toPlanet == planetId)
        .filter((v) => v.fromPlanet == from).length +
      df.getUnconfirmedMoves().filter((m) => m.to == planetId && m.from == from)
        .length
    );
  }
}

export function planetPower(planet) {
  return (planet.energy * planet.defense) / 100;
}
export function planetPercentEnergy(planet, percentCap = 25) {
  const unconfirmedDepartures = planet.unconfirmedDepartures.reduce(
    (acc, dep) => {
      return acc + dep.forces;
    },
    0
  );
  const FUZZY_ENERGY = Math.floor(planet.energy - unconfirmedDepartures);
  return (FUZZY_ENERGY * percentCap) / 100;
}
export function planetCurrentPercentEnergy(planet) {
  const unconfirmedDepartures = planet.unconfirmedDepartures.reduce(
    (acc, dep) => {
      return acc + dep.forces;
    },
    0
  );
  const FUZZY_ENERGY = Math.floor(planet.energy - unconfirmedDepartures);
  return Math.floor((FUZZY_ENERGY / planet.energyCap) * 100);
}

export function getCoords(planetLocationId) {
  try {
    return df.planetHelper.planetLocationMap[planetLocationId].coords;
  } catch (err) {
    console.error(err);
    console.log(`unable to find ${planetLocationId} in planetLocationMap`);
    return { x: 0, y: 0 };
  }
}
export function getDistance(a, b) {
  const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  return dist;
}

export function getEnergyArrival(srcId, synId, percentageSend = 25) {
  const { energyCap } = df.getPlanetWithId(srcId);
  const payload = (energyCap * percentageSend) / 100;
  return df.getEnergyArrivingForMove(srcId, synId, payload);
}
export function findNearBy(
  planetLocationId,
  maxDistance = 5000,
  levelLimit = 3,
  numOfPlanets = 5
) {
  const owned = df.getMyPlanets();

  ownedFiltered = owned
    .filter((p) => p.planetLevel <= levelLimit)
    .filter(
      (p) =>
        getDistance(getCoords(planetLocationId), getCoords(p.locationId)) <
        maxDistance
    );
  const mapped = ownedFiltered.map((p) => {
    const landingForces = getEnergyArrival(p.locationId, planetLocationId);
    return {
      landingForces,
      planet: p,
    };
  });
}
export function findWeapons(
  planetLocationId,
  levelLimit = 7,
  numOfPlanets = 5,
  percentageSend = 80,
  maxDist = 1500
) {
  const warmWeapons = df
    .getMyPlanets()
    .filter((p) => p.planetLevel <= levelLimit)
    .filter((p) => planetCurrentPercentEnergy(p) > 80);
  const mapped = warmWeapons.map((p) => {
    const landingForces = getEnergyArrival(
      p.locationId,
      planetLocationId,
      percentageSend
    );
    return {
      landingForces,
      planet: p,
    };
  });

  mapped.sort((a, b) => {
    return b.landingForces - a.landingForces;
  });
  return mapped.map((p) => p.planet).slice(0, numOfPlanets);
}

export function modelEnergyGrowth(energy, energyGrowth, duration = 10) {
  const denom =
    Math.exp((-4 * energyGrowth * duration) / energyCap) *
      (energyCap / energy - 1) +
    1;
  return energyCap / denom;
}
