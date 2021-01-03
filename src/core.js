import {
  createPester,
  pester,
  explore,
  createExplore,
  delayedMove,
  chainedMove,
  markChainedMoveSent,
} from "./subroutines/index.js";
import { createSwarm, createFlood, createOverload } from "./routines/index.js";
import { capturePlanets } from "./capturePlanets.js";
import { distributeSilver } from "./distributeSilver.js";
import { default as c } from "./constants.js";
import * as utils from "./utils/index.js";
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
export class Manager {
  actions = [];
  intervalId = "";
  version = "0.0.1";
  dead = false;
  utils = utils;
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
    this.intervalId = setInterval(this.coreLoop.bind(this), 15000);
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
  digIn(locationId, levelLimit = 3, maxDistributeEnergyPercent = 50) {
    capturePlanets(locationId, levelLimit, maxDistributeEnergyPercent, []);
  }
  expand() {
    const owned = df.getMyPlanets();
    let captured = [];
    owned.forEach(async (p) => {
      captured = await capturePlanets(p.locationId, 3, 50, captured);
    });
  }

  distribute(minPlanetLevel = 4) {
    const owned = df.getMyPlanets().filter((p) => p.silverGrowth > 0);
    let captured = [];
    owned.forEach(async (p) => {
      captured = await distributeSilver(p.locationId, 40, minPlanetLevel);
    });
  }

  upgrade() {
    const getNextUpgrade = (planet) => {
      return planet.upgradeState[0] < 2 ? 0 : 1;
    };
    df.getMyPlanets()
      .filter((p) => df.entityStore.planetCanUpgrade(p))
      .forEach((p) => df.upgrade(p.locationId, getNextUpgrade(p)));
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
    return (
      df.getUnconfirmedMoves().length > 2 &&
      df.getUnconfirmedUpgrades().length > 2
    );
  }

  async coreLoop() {
    if (this.actions.length > 0) {
      terminal.println("[CORE]: Running Subroutines", 2);
    }
    asyncForEach(this.actions, async (action) => {
      if (this.checkForOOMThreat()) {
        // Prevent OOM bug when executing too many snarks in parallel
        return;
      }
      try {
        switch (action.type) {
          case c.PESTER:
            pester(
              action.payload.srcId,
              action.payload.syncId,
              action.payload.percentageTrigger,
              action.payload.percentageSend
            );
            break;
          case c.FEED:
            pester(
              action.payload.srcId,
              action.payload.syncId,
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
            break;
          case c.DELAYED_MOVE:
            if (delayedMove(action)) {
              //send once
              this.delete(action.id);
            }
            break;
          case c.CHAINED_MOVE:
            if (action.meta.sent == false) {
              if (await chainedMove(action)) {
                this.update(markChainedMoveSent(action));
              }
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(action);
        console.error(error);
      }
      return;
    });
  }
  unswarm(planetId) {
    this.actions = this.actions.filter((a) => {
      return a.payload.opponentsPlanetLocationsId !== planetId;
    });
  }
  flood(
    planetId,
    levelLimit = 7,
    numOfPlanets = 5,
    searchRangeSec = 60 * 60,
    test = false
  ) {
    if (this.dead) {
      console.log("[CORELOOP IS DEAD], flood ignored");
      return;
    }

    let actions = createFlood(
      planetId,
      levelLimit,
      numOfPlanets,
      searchRangeSec,
      test
    );
    if (test) {
      return actions;
    } else {
      actions.forEach((a) => this.createAction(a));
    }
  }
  overload(
    srcId,
    targetId,
    searchRangeSec = 30 * 60,
    levelLimit = 4,
    numOfPlanets = 5,
    test = false
  ) {
    if (this.dead) {
      console.log("[CORELOOP IS DEAD], flood ignored");
      return;
    }

    let actions = createOverload(
      srcId,
      targetId,
      searchRangeSec,
      levelLimit,
      numOfPlanets,
      test
    );
    if (test) {
      return actions;
    } else {
      actions.forEach((a) => this.createAction(a));
    }
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
    this.storeActions();
  }
  update(action) {
    this.actions = [...this.actions.filter((a) => a.id !== action.id), action];
    this.storeActions();
  }
  wipeActionsFromPlanet(locationId) {
    this.actions = this.actions.filter((a) => {
      if (a.type !== "PESTER") {
        return a.yourPlanetLocationId !== locationId;
      }
      return true;
    });
  }
  _wipeActions() {
    this.actions = [];
    this.storeActions();
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
  _not_working_centerPlanet(locationId) {
    let p = df.getPlanetWithId(locationId);
    uiManager.setSelectedPlanet(p);
    uiManager.emit("centerLocation", p);
  }
  rehydrate() {
    try {
      const raw = window.localStorage.getItem("actions");
      if (raw === null) {
        console.error("No Actions to Rehydrate");
        return;
      }
      const payload = JSON.parse(raw);
      if (utils.version.areVersionsCompatible(this.version, payload?.version)) {
        this.actions = payload.actions;
      }
    } catch (err) {
      console.error("Issue Rehydrating Actions");
      throw err;
    }
  }
}

export { utils as utils };
