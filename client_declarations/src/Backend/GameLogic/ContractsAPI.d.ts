/// <reference types="react" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { providers, ContractFunction } from "ethers";
import { ContractConstants, UpgradeArgs } from "../../_types/darkforest/api/ContractsAPITypes";
import { Player, EthAddress, LocationId, ArtifactId, RevealedCoords, WorldLocation, Artifact, Planet, QueuedArrival, UnconfirmedInit, SubmittedTx, UnconfirmedDepositArtifact, UnconfirmedWithdrawArtifact, UnconfirmedActivateArtifact, UnconfirmedDeactivateArtifact, UnconfirmedReveal, UnconfirmedWithdrawSilver } from "@darkforest_eth/types";
import { TxExecutor } from "../Network/TxExecutor";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
import EthConnection from "../Network/EthConnection";
import { DarkForestCore, DarkForestGetters, DarkForestGPTCredit } from "@darkforest_eth/contracts/typechain";
import type { RevealSnarkContractCallArgs, InitSnarkContractCallArgs, MoveSnarkContractCallArgs, BiomebaseSnarkContractCallArgs } from "@darkforest_eth/snarks";
import UIStateStorageManager from "../Storage/UIStateStorageManager";
import { ContractCaller } from "./ContractCaller";
/**
 * Roughly contains methods that map 1:1 with functions that live
 * in the contract.
 */
declare class ContractsAPI extends EventEmitter {
    readonly contractCaller: ContractCaller;
    readonly txRequestExecutor: TxExecutor | undefined;
    readonly terminal: React.MutableRefObject<TerminalHandle | undefined>;
    ethConnection: EthConnection;
    coreContract: DarkForestCore;
    gettersContract: DarkForestGetters;
    gptCreditContract: DarkForestGPTCredit;
    constructor(ethConnection: EthConnection, terminal: React.MutableRefObject<TerminalHandle | undefined>, coreContract: DarkForestCore, gettersContract: DarkForestGetters, gptCreditContract: DarkForestGPTCredit, uiStateStorageManager: UIStateStorageManager, nonce: number);
    static create(ethConnection: EthConnection, uiStateStorageManager: UIStateStorageManager, terminal: React.MutableRefObject<TerminalHandle | undefined>): Promise<ContractsAPI>;
    destroy(): void;
    makeCall<T>(contractViewFunction: ContractFunction<T>, args?: unknown[]): Promise<T>;
    setupEventListeners(): void;
    removeEventListeners(): void;
    getContractAddress(): EthAddress;
    onTxSubmit(unminedTx: SubmittedTx): void;
    /**
     * Given an unconfirmed (but submitted) transaction, emits the appropriate
     * [[ContractsAPIEvent]].
     */
    waitFor(submitted: SubmittedTx, receiptPromise: Promise<providers.TransactionReceipt>): Promise<providers.TransactionReceipt>;
    onTxConfirmed(unminedTx: SubmittedTx, success: boolean): void;
    reveal(args: RevealSnarkContractCallArgs, action: UnconfirmedReveal): Promise<providers.TransactionReceipt>;
    initializePlayer(args: InitSnarkContractCallArgs, action: UnconfirmedInit): Promise<providers.TransactionReceipt>;
    transferOwnership(planetId: LocationId, newOwner: EthAddress, actionId: string): Promise<providers.TransactionReceipt>;
    upgradePlanet(args: UpgradeArgs, actionId: string): Promise<providers.TransactionReceipt>;
    prospectPlanet(planetId: LocationId, actionId: string): Promise<providers.TransactionReceipt>;
    findArtifact(location: WorldLocation, biomeSnarkArgs: BiomebaseSnarkContractCallArgs, actionId: string): Promise<providers.TransactionReceipt>;
    depositArtifact(action: UnconfirmedDepositArtifact): Promise<providers.TransactionReceipt>;
    withdrawArtifact(action: UnconfirmedWithdrawArtifact): Promise<providers.TransactionReceipt>;
    activateArtifact(action: UnconfirmedActivateArtifact): Promise<providers.TransactionReceipt>;
    deactivateArtifact(action: UnconfirmedDeactivateArtifact): Promise<providers.TransactionReceipt>;
    move(actionId: string, snarkArgs: MoveSnarkContractCallArgs, shipsMoved: number, silverMoved: number, artifactMoved?: ArtifactId): Promise<providers.TransactionReceipt>;
    buyHat(planetIdDecStr: string, currentHatLevel: number, actionId: string): Promise<providers.TransactionReceipt>;
    withdrawSilver(action: UnconfirmedWithdrawSilver): Promise<providers.TransactionReceipt>;
    buyGPTCredits(amount: number, actionId: string): Promise<providers.TransactionReceipt>;
    getGPTCreditPriceEther(): Promise<number>;
    getGPTCreditBalance(address: EthAddress): Promise<number>;
    getConstants(): Promise<ContractConstants>;
    getPlayers(onProgress?: (fractionCompleted: number) => void): Promise<Map<string, Player>>;
    getPlayerById(playerId: EthAddress): Promise<Player | undefined>;
    getWorldRadius(): Promise<number>;
    getTokenMintEndTimestamp(): Promise<number>;
    getContractBalance(): Promise<number>;
    getArrival(arrivalId: number): Promise<QueuedArrival | undefined>;
    getArrivalsForPlanet(planetId: LocationId): Promise<QueuedArrival[]>;
    getAllArrivals(planetsToLoad: LocationId[], onProgress?: (fractionCompleted: number) => void): Promise<QueuedArrival[]>;
    getTouchedPlanetIds(startingAt: number, onProgress?: (fractionCompleted: number) => void): Promise<LocationId[]>;
    getRevealedCoordsByIdIfExists(planetId: LocationId): Promise<RevealedCoords | undefined>;
    getRevealedPlanetsCoords(startingAt: number, onProgressIds?: (fractionCompleted: number) => void, onProgressCoords?: (fractionCompleted: number) => void): Promise<RevealedCoords[]>;
    bulkGetPlanets(toLoadPlanets: LocationId[], onProgressPlanet?: (fractionCompleted: number) => void, onProgressMetadata?: (fractionCompleted: number) => void): Promise<Map<LocationId, Planet>>;
    getPlanetById(planetId: LocationId): Promise<Planet | undefined>;
    getArtifactById(artifactId: ArtifactId): Promise<Artifact | undefined>;
    bulkGetArtifactsOnPlanets(locationIds: LocationId[], onProgress?: (fractionCompleted: number) => void): Promise<Artifact[][]>;
    bulkGetArtifacts(artifactIds: ArtifactId[], onProgress?: (fractionCompleted: number) => void): Promise<Artifact[]>;
    getPlayerArtifacts(playerId: EthAddress, onProgress?: (percent: number) => void): Promise<Artifact[]>;
    getAccount(): EthAddress;
    getBalance(): Promise<number>;
}
export default ContractsAPI;
