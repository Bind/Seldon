import { IDBPDatabase } from "idb";
import { ChunkStore } from "../../_types/darkforest/api/ChunkStoreTypes";
import { ExploredChunkData, Rectangle } from "../../_types/global/GlobalTypes";
import { SerializedPlugin } from "../Plugins/SerializedPlugin";
import { EthAddress, LocationId, SubmittedTx, WorldLocation, RevealedCoords } from "@darkforest_eth/types";
declare enum ObjectStore {
    DEFAULT = "default",
    BOARD = "knownBoard",
    UNCONFIRMED_ETH_TXS = "unminedEthTxs",
    PLUGINS = "plugins"
}
declare enum DBActionType {
    UPDATE = 0,
    DELETE = 1
}
interface DBAction {
    type: DBActionType;
    dbKey: string;
    dbValue?: ExploredChunkData;
}
declare type DBTx = DBAction[];
interface DebouncedFunc<T extends () => void> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel(): void;
}
declare class PersistentChunkStore implements ChunkStore {
    db: IDBPDatabase;
    cached: DBTx[];
    throttledSaveChunkCacheToDisk: DebouncedFunc<() => Promise<void>>;
    nUpdatesLastTwoMins: number;
    chunkMap: Map<string, ExploredChunkData>;
    confirmedTxHashes: Set<string>;
    account: EthAddress;
    constructor(db: IDBPDatabase, account: EthAddress);
    destroy(): void;
    static create(account: EthAddress): Promise<PersistentChunkStore>;
    getKey(key: string, objStore?: ObjectStore): Promise<string | undefined>;
    setKey(key: string, value: string, objStore?: ObjectStore): Promise<void>;
    removeKey(key: string, objStore?: ObjectStore): Promise<void>;
    bulkSetKeyInCollection(updateChunkTxs: DBTx[], collection: ObjectStore): Promise<void>;
    loadIntoMemory(): Promise<void>;
    saveChunkCacheToDisk(): Promise<void>;
    /**
     * we keep a list rather than a single location, since client/contract can
     * often go out of sync on initialization - if client thinks that init
     * failed but is wrong, it will prompt user to initialize with new home coords,
     * which bricks the user's account.
     */
    getHomeLocations(): Promise<WorldLocation[]>;
    addHomeLocation(location: WorldLocation): Promise<void>;
    confirmHomeLocation(location: WorldLocation): Promise<void>;
    getSavedTouchedPlanetIds(): Promise<LocationId[]>;
    getSavedRevealedCoords(): Promise<RevealedCoords[]>;
    saveTouchedPlanetIds(ids: LocationId[]): Promise<void>;
    saveRevealedCoords(revealedCoordTups: RevealedCoords[]): Promise<void>;
    getChunkByFootprint(chunkLoc: Rectangle): ExploredChunkData | undefined;
    hasMinedChunk(chunkLoc: Rectangle): boolean;
    getChunkById(chunkId: string): ExploredChunkData | undefined;
    updateChunk(e: ExploredChunkData, loadedFromStorage?: boolean): void;
    getMinedSubChunks(e: ExploredChunkData): ExploredChunkData[];
    recomputeSaveThrottleAfterUpdate(): void;
    allChunks(): Iterable<ExploredChunkData>;
    onEthTxSubmit(tx: SubmittedTx): Promise<void>;
    onEthTxComplete(txHash: string): Promise<void>;
    getUnconfirmedSubmittedEthTxs(): Promise<SubmittedTx[]>;
    loadPlugins(): Promise<SerializedPlugin[]>;
    savePlugins(plugins: SerializedPlugin[]): Promise<void>;
}
export default PersistentChunkStore;
