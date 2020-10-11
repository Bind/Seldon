(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Seldon = factory());
}(this, (function () { 'use strict';

  function checkNumInboundVoyages(planetId, from = "") {
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
  function planetCurrentPercentEnergy(planet) {
    const unconfirmedDepartures = planet.unconfirmedDepartures.reduce(
      (acc, dep) => {
        return acc + dep.forces;
      },
      0
    );
    const FUZZY_ENERGY = Math.floor(planet.energy - unconfirmedDepartures);
    return Math.floor((FUZZY_ENERGY / planet.energyCap) * 100);
  }

  function getCoords(planetLocationId) {
    try {
      return df.planetHelper.planetLocationMap[planetLocationId].coords;
    } catch (err) {
      console.error(err);
      console.log(`unable to find ${planetLocationId} in planetLocationMap`);
      return { x: 0, y: 0 };
    }
  }
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

    mapped.sort((a, b) => {
      return b.landingForces - a.landingForces;
    });
    return mapped.slice(0, numOfPlanets);
  }

  const PIRATES = "0x0000000000000000000000000000000000000000";
  const c = {
    PESTER: "PESTER",
    AID: "AID",
    FEED: "AID",
    SUPPLY: "SUPPLY",
    EXPLORE: "EXPLORE",
    PIRATES,
  };

  // A recurring attack

  function pester(
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

  function createPester(
    srcId,
    syncId,
    percentageTrigger = 75,
    percentageSend = 45,
    meta = {}
  ) {
    return {
      id: `[PESTER]-${yourPlanetLocationId}-${opponentsPlanetLocationsId}-${percentageTrigger}-${percentageSend}`,
      type: c.PESTER,
      payload: {
        srcId,
        syncId,
        percentageTrigger,
        percentageSend,
      },
      meta,
    };
  }

  function explore(
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
      .filter((p) => checkNumInboundVoyages(p.planetId, explorer.owner) < 1)
      //Energy Needed to Take
      .filter(
        (p) =>
          df.getEnergyNeededForMove(srcId, p.locationId, planetPower(p)) <
          planetPercentEnergy(explorer, percentageSend)
      );
    takeable.sort((a, b) => b.planetLevel - a.planetLevel);
    if (takeable.length > 0) {
      console.log("[EXPLORE]: LAUNCHING EXPLORATION");
      terminal.println("[EXPLORE]: LAUNCHING EXPLORATIONINTERVAL", 4);
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
        `[EXPLORER]: ${explorer.id} has not valid targets consider increasing percentageSend`
      );
      terminal.println(
        `[EXPLORER]: ${explorer.id} has not valid targets consider increasing percentageSend`,
        3
      );
    }
  }

  function createExplore(
    srcId,
    percentageRange = 75,
    percentageSend = 25,
    minLevel = 3
  ) {
    return {
      id: `[EXPLORE]-${ownPlanetId}-${percentageRange}-${percentageSend}-${minLevel}`,
      type: c.EXPLORE,
      payload: {
        srcId,
        percentageRange,
        percentageSend,
        minLevel,
      },
    };
  }

  function createSwarm(
    planetId,
    maxDistance = 5000,
    levelLimit = 5,
    numOfPlanets = 5
  ) {
    const nearby = findNearBy(planetId, maxDistance, levelLimit, numOfPlanets);
    nearby.map((p) => {
      return createPester(p.planet.locationId, planetId, 75, 40, {
        tag: "SWARM",
      });
    });
  }

  function parseVersionString(string) {
    const [major, minor, patch] = string.split(".");
    return { major, minor, patch };
  }

  function areVersionsCompatible(newVersion, oldVersion) {
    if (!oldVersion) {
      return false;
    }
    const newV = parseVersionString(newVersion);
    const oldV = parseVersionString(oldVersion);
    if (newV.major !== oldV.major) {
      //Raise Error
      return false;
    } else if (newV.minor !== oldV.minor) {
      //Should have a migration available
      return false;
    } else if (newV.patch !== oldV.patch) {
      //Should not effect actions schema
      return true;
    }
  }

  class Manager {
    actions = [];
    intervalId = "";
    version = "0.0.1";
    dead = false;

    constructor(blob = []) {
      if (typeof window.__SELDON_CORELOOP__ == "undefined") {
        //setup append only interval id storage
        window.__SELDON_CORELOOP__ = [];
      } else {
        //clear out old intervald
        window.__SELDON_CORELOOP.forEach((id) => clearInterval(id));
      }
      if (blob.length > 0) {
        this.actions = blob;
        this.storeActions();
      }
      this.intervalId = setInterval(this.coreLoop.bind(this), 60000);
      window.__SELDON_CORELOOP__.push(this.intervalId);
      //aliases
      this.p = this.createPester.bind(this);
      this.s = this.swarm.bind(this);
      this.a = this.createAid.bind(this);
      this.e = this.createExplore.bind(this);
    }
    storeActions() {
      window.localStorage.setItem(
        "actions",
        JSON.stringify({ version: this.version, actions: this.actions })
      );
    }
    createAction(action) {
      this.actions.push(action);
      this.storeActions();
    }
    exploreDirective() {
      terminal.println("[CORE]: Running Directive Explore", 2);
      try {
        const busy = this.actions
          .filter((a) => a.type == this.c.PESTER)
          .map((a) => a.payload.yourPlanetLocationId);
        console.log(busy);
        df.getMyPlanets()
          .filter((p) => busy.includes(p.location))
          .forEach((p) => {
            console.log(p.locationId);
            this.explore(p.locationId, 75, 50, 2);
          });
      } catch (err) {
        console.log(err);
      }
    }

    coreLoop() {
      // this.exploreDirective();
      terminal.println("[CORE]: Running Subroutines", 2);
      this.actions.forEach((action) => {
        try {
          switch (action.type) {
            case this.c.PESTER:
              pester(
                action.payload.yourPlanetLocationId,
                action.payload.opponentsPlanetLocationsId,
                action.payload.percentageTrigger,
                action.payload.percentageSend
              );
              break;
            case this.c.FEED:
              pester(
                action.payload.sourcePlanetLocationId,
                action.payload.syncPlanetLocationsId,
                action.payload.percentageTrigger,
                action.payload.percentageSend
              );
              break;
            case this.c.EXPLORE:
              explore(
                action.payload.ownPlanetId,
                action.payload.percentageRange,
                action.payload.percentageSend,
                action.payload.minLevel
              );
            case this.c.SUPPLY:
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
    unswarm(planetId) {
      this.actions = this.actions.filter((a) => {
        return a.payload.opponentsPlanetLocationsId !== planetId;
      });
    }
    swarm(planetId, maxDistance = 5000, levelLimit = 5, numOfPlanets = 5) {
      if (this.dead) {
        console.log("[CORELOOP IS DEAD], swarm ignored");
        return;
      }
      createSwarm(
        planetId,
        (maxDistance = 5000),
        (levelLimit = 5),
        (numOfPlanets = 5)
      ).forEach((action) => this.createAction(action));
    }
    createExplore(
      ownPlanetId,
      percentageRange = 75,
      percentageSend = 25,
      minLevel = 3
    ) {
      if (this.dead) {
        console.log("[CORELOOP IS DEAD], createExplore ignored");
        return;
      }
      this.createAction(
        createExplore(ownPlanetId, percentageRange, percentageSend, minLevel)
      );
    }
    createPester(
      yourPlanetLocationId,
      opponentsPlanetLocationsId,
      percentageTrigger = 75,
      percentageSend = 45,
      meta = {}
    ) {
      if (this.dead) {
        console.log("[CORELOOP IS DEAD], createPester ignored");
        return;
      }
      this.createAction(
        createPester(
          yourPlanetLocationId,
          opponentsPlanetLocationsId,
          percentageTrigger,
          percentageSend,
          meta
        )
      );
    }

    delete(id) {
      this.actions = this.actions.filter((a) => a.id !== id);
    }
    wipeActionsFromPlanet(locationId) {
      this.actions = this.actions.filter((a) => {
        if (a.type !== "PESTER") {
          return a.yourPlanetLocationId !== locationId;
        }
        return true;
      });
    }
    kill() {
      console.log(`KILLING CORE LOOP ${this.intervalId}`);
      this.dead = true;
      clearInterval(this.intervalId);
    }
    killAll() {
      window.__SELDON_CORELOOP__.forEach((intervalId) =>
        clearInterval(intervalId)
      );
    }
    pause() {
      this.dead = true;
      clearInterval(this.intervalId);
    }
    restart() {
      this.intervalId = setInterval(this.coreLoop.bind(this), 30000);
      window.__SELDON_CORELOOP__.push(this.intervalId);
      this.dead = false;
    }
    printActions() {
      console.log(JSON.stringify(this.actions));
    }
    listActions() {
      console.log(this.actions);
    }
    rehydrate() {
      try {
        if (typeof object == "undefined") {
          const raw = window.localStorage.getItem("actions");
          if (raw === null) {
            console.error("No Actions to Rehydrate");
            return;
          }
          const payload = JSON.parse(raw);
          if (areVersionsCompatible(this.version, payload?.version)) {
            this.actions = actions;
          }
        }
      } catch (err) {}
    }
  }

  return Manager;

})));
