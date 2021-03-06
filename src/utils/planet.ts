import { df } from "../types/global";
import { LocationId, Planet } from "@darkforest_eth/types";
export function checkNumInboundVoyages(planetId, from = "") {
  if (from == "") {
    return (
      df
        .getAllVoyages()
        .filter(
          (v) =>
            v.toPlanet == planetId &&
            v.arrivalTime > new Date().getTime() / 1000
        ).length +
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
export function planetPercentEnergy(
  planet: Planet,
  percentCap: number = 25
): number {
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

export function getDistance(a, b) {
  const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  return dist;
}

export function getEnergyArrival(srcId, syncId, percentageSend = 25) {
  const _pl = df.getPlanetWithId(srcId);
  if (!_pl) {
    return;
  }
  const { energyCap } = _pl;
  const payload = (energyCap * percentageSend) / 100;
  const sync = df.getPlanetWithId(syncId);
  if (!sync) {
    return;
  }
  const dist = df.getDist(srcId, syncId);
  return (
    df.getEnergyArrivingForMove(srcId, syncId, dist, payload) /
    (sync.defense / 100)
  );
}
export function getEnergyArrivalAbs(srcId, syncId, energy) {
  const sync = df.getPlanetWithId(syncId);
  if (!sync) {
    return;
  }
  const dist = df.getDist(srcId, syncId);
  return df.getEnergyArrivingForMove(srcId, syncId, dist, energy);
}
export function findNearBy(
  planetLocationId,
  maxDistance = 5000,
  levelLimit = 3,
  numOfPlanets = 5
) {
  const owned = df.getMyPlanets();

  const ownedFiltered = owned
    .filter((p) => p.locationId !== planetLocationId)
    .filter((p) => p.planetLevel <= levelLimit)
    .filter((p) => df.getDist(planetLocationId, p.locationId) < maxDistance);
  ownedFiltered.sort(
    (a, b) =>
      df.getDist(planetLocationId, a.locationId) -
      df.getDist(planetLocationId, b.locationId)
  );
  return ownedFiltered.slice(0, numOfPlanets).map((p) => {
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
  maxTime = 30 * 60,
  excludeList: LocationId[] = []
) {
  const warmWeapons = df
    .getMyPlanets()
    .filter((p) => p.locationId !== planetLocationId)
    .filter((p) => p.planetLevel <= levelLimit)
    .filter((p) => !excludeList.includes(p.locationId))
    .filter((p) => df.getTimeForMove(p.locationId, planetLocationId) < maxTime);
  const mapped = warmWeapons.map((p) => {
    const landingForces = getEnergyArrival(
      p.locationId,
      planetLocationId,
      planetCurrentPercentEnergy(p)
    );
    return {
      landingForces,
      planet: p,
    } as {
      landingForces: number;
      planet: Planet;
    };
  });

  mapped.sort((a, b) => {
    return b.landingForces - a.landingForces;
  });
  return mapped.map((p) => p.planet).slice(0, numOfPlanets);
}
export function planetIsRevealed(planetId) {
  return !!df.contractsAPI.getRevealedCoordsByIdIfExists(planetId);
}
export async function waitingForPassengers(locationId, passengersArray) {
  const arrivals = await df.contractsAPI.coreContract.getArrivalsForPlanet(
    locationId
  );
  return (
    arrivals
      .filter((a) => a.player == df.account)
      .filter((a) => a.arrivalTime * 1000 > new Date().getTime()) //If not arrived
      .filter((a) => passengersArray.includes(a.fromPlanet)).length > 0
  );
}

function moveEnergyDecay(energy, srcPlanet, dist) {
  const scale = (1 / 2) ** (dist / srcPlanet.range);
  let ret = scale * energy - 0.05 * srcPlanet.energyCap;
  if (ret < 0) ret = 0;
  return ret;
}

export function modelEnergyNeededToTake(srcId, syncId) {
  const src = df.getPlanetWithId(srcId);
  const sync = df.getPlanetWithId(srcId);
  if (!src || !sync) {
    return;
  }
  const dist = df.getDist(srcId, syncId);
  const power_needed_on_arrival = ((sync.energy * sync.defense) / 100) * 1.2; //Want a little buffer
  const scale = (1 / 2) ** (dist / src.range);
  const power_needed_to_send =
    power_needed_on_arrival / scale + 0.05 * src.energyCap;

  return power_needed_to_send;
}

function modelEnergyGrowth(energy, energyGrowth, energyCap, duration = 10) {
  const denom =
    Math.exp((-4 * energyGrowth * duration) / energyCap) *
      (energyCap / energy - 1) +
    1;
  return energyCap / denom;
}

function modelEnergyDecline(energy, energyGrowth, energyCap, duration = 10) {
  return energy - modelEnergyGrowth(energy, energyGrowth, energyCap, duration);
}

function modelEnergyDeclinePercentage(
  energy,
  energyGrowth,
  energyCap,
  duration = 10
) {
  return (
    ((energy - modelEnergyGrowth(energy, energyGrowth, energyCap, duration)) /
      energy) *
    100
  );
}

function modelCurrentEnergyGrowth(energy, energyGrowth, energyCap) {
  const oneTick = 1;

  const denom =
    Math.exp((-4 * energyGrowth * oneTick) / energyCap) *
      (energyCap / energy - 1) +
    1;
  return energyCap / denom - energy;
}
