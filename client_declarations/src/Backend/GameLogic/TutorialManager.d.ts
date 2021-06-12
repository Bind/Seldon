/// <reference types="node" />
import { EventEmitter } from "events";
export declare enum TutorialManagerEvent {
    StateChanged = "StateChanged"
}
export declare enum TutorialState {
    None = 0,
    HomePlanet = 1,
    SendFleet = 2,
    Deselect = 3,
    ZoomOut = 4,
    MinerMove = 5,
    MinerPause = 6,
    Terminal = 7,
    HowToGetScore = 8,
    Valhalla = 9,
    AlmostCompleted = 10,
    Completed = 11
}
declare class TutorialManager extends EventEmitter {
    static instance: TutorialManager;
    tutorialState: TutorialState;
    constructor();
    static getInstance(): TutorialManager;
    setTutorialState(newState: TutorialState): void;
    advance(): void;
    reset(): void;
    complete(): void;
    acceptInput(state: TutorialState): void;
}
export default TutorialManager;
