import { Dispatch, SetStateAction } from 'react';
import { LocationId, Planet, LocatablePlanet, WorldCoords, WorldLocation } from '@darkforest_eth/types';
import GameManager from '../../Backend/GameLogic/GameManager';
import GameUIManager from '../../Backend/GameLogic/GameUIManager';
export declare type Hook<T> = [T, Dispatch<SetStateAction<T>>];
export declare type Wormhole = {
    from: LocationId;
    to: LocationId;
};
declare global {
    interface Window {
        snarkjs: any;
        df?: GameManager;
        ui?: GameUIManager;
    }
}
export declare type HashConfig = {
    planetHashKey: number;
    spaceTypeKey: number;
    biomebaseKey: number;
    perlinLengthScale: number;
    perlinMirrorX: boolean;
    perlinMirrorY: boolean;
};
export declare enum StatIdx {
    EnergyCap = 0,
    EnergyGro = 1,
    Range = 2,
    Speed = 3,
    Defense = 4
}
export declare function isLocatable(planet: Planet): planet is LocatablePlanet;
export interface Rectangle {
    bottomLeft: WorldCoords;
    sideLength: number;
}
export declare class ExploredChunkData {
    chunkFootprint: Rectangle;
    planetLocations: WorldLocation[];
    perlin: number;
}
export interface MinerWorkerMessage {
    chunkFootprint: Rectangle;
    workerIndex: number;
    totalWorkers: number;
    planetRarity: number;
    jobId: number;
    useMockHash: boolean;
    planetHashKey: number;
    spaceTypeKey: number;
    biomebaseKey: number;
    perlinLengthScale: number;
    perlinMirrorX: boolean;
    perlinMirrorY: boolean;
}
export interface RevealCountdownInfo {
    myLastRevealTimestamp?: number;
    currentlyRevealing: boolean;
    revealCooldownTime: number;
}
