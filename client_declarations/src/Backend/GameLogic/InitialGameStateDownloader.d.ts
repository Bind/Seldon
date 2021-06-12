import { VoyageId, QueuedArrival, LocationId, Artifact, Player, RevealedCoords, Planet } from "@darkforest_eth/types";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
import { ContractConstants } from "../../_types/darkforest/api/ContractsAPITypes";
import PersistentChunkStore from "../Storage/PersistentChunkStore";
import ContractsAPI from "./ContractsAPI";
export interface InitialGameState {
    contractConstants: ContractConstants;
    players: Map<string, Player>;
    worldRadius: number;
    gptCreditPriceEther: number;
    myGPTCredits: number;
    allTouchedPlanetIds: LocationId[];
    allRevealedCoords: RevealedCoords[];
    pendingMoves: QueuedArrival[];
    touchedAndLocatedPlanets: Map<LocationId, Planet>;
    artifactsOnVoyages: Artifact[];
    myArtifacts: Artifact[];
    heldArtifacts: Artifact[][];
    loadedPlanets: LocationId[];
    balance: number;
    revealedCoordsMap: Map<LocationId, RevealedCoords>;
    planetVoyageIdMap: Map<LocationId, VoyageId[]>;
    arrivals: Map<VoyageId, QueuedArrival>;
}
export declare class InitialGameStateDownloader {
    terminal: TerminalHandle;
    constructor(terminal: TerminalHandle);
    makeProgressListener(prettyEntityName: string): (percent: number) => void;
    download(contractsAPI: ContractsAPI, persistentChunkStore: PersistentChunkStore): Promise<InitialGameState>;
}
