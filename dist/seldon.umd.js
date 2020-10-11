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
  }
  function findWeapons(
    planetLocationId,
    levelLimit = 7,
    numOfPlanets = 5,
    percentageSend = 80
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

  const PIRATES = "0x0000000000000000000000000000000000000000";
  const c = {
    PESTER: "PESTER",
    AID: "AID",
    FEED: "AID",
    SUPPLY: "SUPPLY",
    EXPLORE: "EXPLORE",
    DELAYED_MOVE: "DELAYED_MOVE",
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
      id: `[EXPLORE]-${srcId}-${percentageRange}-${percentageSend}-${minLevel}`,
      type: c.EXPLORE,
      payload: {
        srcId,
        percentageRange,
        percentageSend,
        minLevel,
      },
    };
  }

  function delayedMove(action) {
    const { srcId, syncId, sendAt, percentageSend } = action.payload;

    const match = df.getMyPlanets().filter((t) => t.locationId == srcId);
    if (match.length == 0) {
      //Should delete self on this case
      return;
    }
    const source = match[0];
    if (checkNumInboundVoyages(syncId) >= 7) {
      //Too many inbound
      return;
    }

    const FORCES = Math.floor((source.energyCap * percentageSend) / 100);

    if (sendAt < new Date().getTime()) {
      console.log("[DELAYED]: LAUNCHING ATTACK");
      terminal.println("[DELAYED]: LAUNCHING ATTACK", 4);

      //send attack
      terminal.jsShell(`df.move('${srcId}', '${syncId}', ${FORCES}, ${0})`);
      df.move(srcId, syncId, FORCES, 0);
      return true;
    }
    return false;
  }

  function createDelayedMove(srcId, syncId, sendAt, percentageSend = 80) {
    return {
      type: c.DELAYED_MOVE,
      id: `${c.DELAYED_MOVE}-${srcId}-${syncId}`,
      payload: {
        srcId,
        syncId,
        sendAt,
        percentageSend,
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

  function secondsToMs(s) {
    return s * 1000;
  }

  function createFlood(
    locationId,
    levelLimit = 7,
    numOfPlanets = 5
  ) {
    const weapons = findWeapons(locationId, levelLimit, numOfPlanets, 80);
    //Sort by who will take longest to land

    weapons.sort(
      (a, b) =>
        df.getTimeForMove(b.locationId, locationId) -
        df.getTimeForMove(a.locationId, locationId)
    );
    const ETA_MS =
      new Date().getTime() +
      secondsToMs(df.getTimeForMove(weapons[0].locationId, locationId)) +
      secondsToMs(10);
    //Add 10 seconds for processing
    return weapons.map((p) => {
      return createDelayedMove(
        p.locationId,
        locationId,
        Math.floor(
          ETA_MS - secondsToMs(df.getTimeForMove(p.locationId, locationId))
        )
      );
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
    } else {
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
        console.log("KILLING PREVIOUS INTERVALS");
        window.__SELDON_CORELOOP__.forEach((id) => clearInterval(id));
      }
      if (blob.length > 0) {
        this.actions = blob;
        this.storeActions();
      }
      this.rehydrate();
      this.intervalId = setInterval(this.coreLoop.bind(this), 60000);
      window.__SELDON_CORELOOP__.push(this.intervalId);
      //aliases
      this.p = this.createPester.bind(this);
      this.pester = this.createPester.bind(this);
      this.s = this.swarm.bind(this);
      this.e = this.createExplore.bind(this);
      this.explore = this.createExplore.bind(this);
      this.f = this.flood.bind(this);
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
    checkForOOMThreat() {
      return (df.getUnconfirmedMoves().length =
        df.getUnconfirmedUpgrades().length > 4);
    }

    coreLoop() {
      if (this.checkForOOMThreat()) {
        // Prevent OOM bug when executing too many snarks in parallel
        return;
      }
      terminal.println("[CORE]: Running Subroutines", 2);
      this.actions.forEach((action) => {
        df.getUnconfimred;
        try {
          switch (action.type) {
            case c.PESTER:
              pester(
                action.payload.yourPlanetLocationId,
                action.payload.opponentsPlanetLocationsId,
                action.payload.percentageTrigger,
                action.payload.percentageSend
              );
              break;
            case c.FEED:
              pester(
                action.payload.sourcePlanetLocationId,
                action.payload.syncPlanetLocationsId,
                action.payload.percentageTrigger,
                action.payload.percentageSend
              );
              break;
            case c.EXPLORE:
              explore(
                action.payload.ownPlanetId,
                action.payload.percentageRange,
                action.payload.percentageSend,
                action.payload.minLevel
              );
            case c.DELAYED_MOVE:
              if (delayedMove(action)) {
                //send once
                this.delete(action.id);
              }
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
    flood(planetId, levelLimit = 7, numOfPlanets = 5) {
      if (this.dead) {
        console.log("[CORELOOP IS DEAD], flood ignored");
        return;
      }
      createFlood(planetId, levelLimit, numOfPlanets).forEach((a) =>
        this.createAction(a)
      );
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
            this.actions = payload.actions;
          }
        }
      } catch (err) {
        console.error("Issue Rehydrating Actions");
        throw err;
      }
    }
  }

  return Manager;

})));
