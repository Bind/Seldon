import { createPester, pester, explore, createExplore } from "./subroutines";
import { createSwarm } from "./routines";
import { areVersionsCompatible } from "./utils";
import { default as c } from "./constants";
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
export default Manager;
