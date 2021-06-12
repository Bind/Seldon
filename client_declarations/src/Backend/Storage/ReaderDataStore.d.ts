/// <reference types="react" />
import { EthAddress, SpaceType, Biome, Planet, LocatablePlanet, WorldLocation, LocationId, ArtifactId } from "@darkforest_eth/types";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
import { ContractConstants } from "../../_types/darkforest/api/ContractsAPITypes";
import { AddressTwitterMap } from "../../_types/darkforest/api/UtilityServerAPITypes";
import ContractsAPI from "../GameLogic/ContractsAPI";
import EthConnection from "../Network/EthConnection";
import PersistentChunkStore from "./PersistentChunkStore";
export declare enum SinglePlanetDataStoreEvent {
    REFRESHED_PLANET = "REFRESHED_PLANET",
    REFRESHED_ARTIFACT = "REFRESHED_ARTIFACT"
}
/**
 * A data store that allows you to retrieve data from the contract,
 * and combine it with data that is stored in this browser about a
 * particular user.
 */
declare class ReaderDataStore {
    readonly viewer: EthAddress | undefined;
    readonly addressTwitterMap: AddressTwitterMap;
    readonly contractConstants: ContractConstants;
    readonly contractsAPI: ContractsAPI;
    readonly persistentChunkStore: PersistentChunkStore | undefined;
    constructor(viewer: EthAddress | undefined, addressTwitterMap: AddressTwitterMap, contractConstants: ContractConstants, contractsAPI: ContractsAPI, persistentChunkStore: PersistentChunkStore | undefined);
    destroy(): void;
    static create(terminal: React.MutableRefObject<TerminalHandle | undefined>, ethConnection: EthConnection, viewer: EthAddress | undefined): Promise<ReaderDataStore>;
    getViewer(): EthAddress | undefined;
    getTwitter(owner: EthAddress | undefined): string | undefined;
    setPlanetLocationIfKnown(planet: Planet): void;
    loadPlanetFromContract(planetId: LocationId): Promise<Planet | LocatablePlanet>;
    loadArtifactFromContract(artifactId: ArtifactId): Promise<import("@darkforest_eth/types").Artifact>;
    spaceTypeFromPerlin(perlin: number): SpaceType;
    getBiome(loc: WorldLocation): Biome;
}
export default ReaderDataStore;
