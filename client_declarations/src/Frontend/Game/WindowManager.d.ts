/// <reference types="node" />
import { EventEmitter } from "events";
import { WorldCoords } from "@darkforest_eth/types";
export declare type MousePos = {
    x: number;
    y: number;
};
export declare enum WindowManagerEvent {
    StateChanged = "StateChanged",
    MiningCoordsUpdate = "MiningCoordsUpdate",
    TooltipUpdated = "TooltipUpdated",
    CtrlDown = "CtrlDown",
    CtrlUp = "CtrlUp"
}
export declare enum CursorState {
    Normal = 0,
    TargetingExplorer = 1,
    TargetingForces = 2
}
export declare enum TooltipName {
    None = 0,
    SilverGrowth = 1,
    SilverCap = 2,
    Silver = 3,
    TwitterHandle = 4,
    Bonus = 5,
    MinEnergy = 6,
    Time50 = 7,
    Time90 = 8,
    Pirates = 9,
    Upgrades = 10,
    PlanetRank = 11,
    MaxLevel = 12,
    FindArtifact = 13,
    ArtifactStored = 14,
    SelectedSilver = 15,
    SelectedEnergy = 16,
    Rank = 17,
    Score = 18,
    MiningPause = 19,
    MiningTarget = 20,
    HashesPerSec = 21,
    CurrentMining = 22,
    HoverPlanet = 23,
    SilverProd = 24,
    BonusEnergyCap = 25,
    BonusEnergyGro = 26,
    BonusRange = 27,
    BonusSpeed = 28,
    BonusDefense = 29,
    Energy = 30,
    EnergyGrowth = 31,
    Range = 32,
    Speed = 33,
    Defense = 34,
    Clowntown = 35,
    ArtifactBuff = 36,
    ModalHelp = 37,
    ModalPlanetDetails = 38,
    ModalLeaderboard = 39,
    ModalPlanetDex = 40,
    ModalUpgradeDetails = 41,
    ModalTwitterVerification = 42,
    ModalTwitterBroadcast = 43,
    ModalHats = 44,
    ModalSettings = 45,
    ModalYourArtifacts = 46,
    ModalFindArtifact = 47,
    ModalPlugins = 48,
    ModalWithdrawSilver = 49
}
declare class WindowManager extends EventEmitter {
    static instance: WindowManager;
    mousePos: MousePos;
    mousedownPos: MousePos | null;
    lastZIndex: number;
    cursorState: CursorState;
    currentTooltip: TooltipName;
    constructor();
    static getInstance(): WindowManager;
    setTooltip(tooltip: TooltipName): void;
    getTooltip(): TooltipName;
    getClickDelta(): MousePos;
    getIndex(): number;
    getCursorState(): CursorState;
    setCursorState(newstate: CursorState): void;
    acceptInputForTarget(input: WorldCoords): void;
}
export default WindowManager;
