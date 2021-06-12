import { EthAddress, LocationId, ArtifactId, VoyageId, Planet, LocatablePlanet, Artifact, WorldCoords, WorldLocation, PlanetLevel, SpaceType, Biome, PlanetType, QueuedArrival, ArrivalWithTimer, UnconfirmedMove, UnconfirmedUpgrade, UnconfirmedBuyHat, UnconfirmedPlanetTransfer, UnconfirmedActivateArtifact, TxIntent, UnconfirmedReveal, UnconfirmedBuyGPTCredits, RevealedLocation } from "@darkforest_eth/types";
import { Monomitter } from "../../Frontend/Utils/Monomitter";
import { ContractConstants } from "../../_types/darkforest/api/ContractsAPITypes";
import { Wormhole, ExploredChunkData } from "../../_types/global/GlobalTypes";
import { LayeredMap } from "./LayeredMap";
import { Radii } from "./ViewportEntities";
export declare class GameObjects {
    readonly address: EthAddress | undefined;
    /**
     * Cached index of all known planet data. This should NEVER be set to directly!
     * All set calls should occur via `GameObjects.setPlanet()`
     */
    readonly planets: Map<LocationId, Planet>;
    /**
     * Cached index of planets owned by the player. This should NEVER be set to directly!
     * All set calls should occur via `GameObjects.setPlanet()`
     */
    readonly myPlanets: Map<LocationId, Planet>;
    /**
     * Cached index of all known artifact data. This should NEVER be set to directly!
     * All set calls should occur via `GameObjects.setArtifact()`
     */
    readonly artifacts: Map<ArtifactId, Artifact>;
    /**
     * Cached index of artifacts owned by the player. This should NEVER be set to directly!
     * All set calls should occur via `GameObjects.setArtifact()`
     */
    readonly myArtifacts: Map<ArtifactId, Artifact>;
    readonly touchedPlanetIds: Set<LocationId>;
    readonly arrivals: Map<VoyageId, ArrivalWithTimer>;
    readonly planetArrivalIds: Map<LocationId, VoyageId[]>;
    readonly planetLocationMap: Map<LocationId, WorldLocation>;
    readonly revealedLocations: Map<LocationId, RevealedLocation>;
    readonly contractConstants: ContractConstants;
    readonly coordsToLocation: Map<string, WorldLocation>;
    unconfirmedReveal?: UnconfirmedReveal;
    unconfirmedBuyGPTCredits?: UnconfirmedBuyGPTCredits;
    readonly unconfirmedMoves: Record<string, UnconfirmedMove>;
    readonly unconfirmedUpgrades: Record<string, UnconfirmedUpgrade>;
    readonly unconfirmedBuyHats: Record<string, UnconfirmedBuyHat>;
    readonly unconfirmedPlanetTransfers: Record<string, UnconfirmedPlanetTransfer>;
    readonly unconfirmedWormholeActivations: UnconfirmedActivateArtifact[];
    readonly wormholes: Map<ArtifactId, Wormhole>;
    readonly layeredMap: LayeredMap;
    readonly planetUpdated$: Monomitter<LocationId>;
    readonly artifactUpdated$: Monomitter<ArtifactId>;
    readonly myArtifactsUpdated$: Monomitter<Map<ArtifactId, Artifact>>;
    readonly myPlanetsUpdated$: Monomitter<Map<LocationId, Planet>>;
    readonly isBuyingCredits$: Monomitter<boolean>;
    constructor(address: EthAddress | undefined, touchedPlanets: Map<LocationId, Planet>, allTouchedPlanetIds: Set<LocationId>, revealedLocations: Map<LocationId, RevealedLocation>, artifacts: Map<ArtifactId, Artifact>, allChunks: Iterable<ExploredChunkData>, unprocessedArrivals: Map<VoyageId, QueuedArrival>, unprocessedPlanetArrivalIds: Map<LocationId, VoyageId[]>, contractConstants: ContractConstants, worldRadius: number);
    getIsBuyingCreditsEmitter(): Monomitter<boolean>;
    getArtifactById(artifactId: ArtifactId): Artifact | undefined;
    getArtifactsOwnedBy(addr: EthAddress): Artifact[];
    getPlanetArtifacts(planetId: LocationId): Artifact[];
    getArtifactsOnPlanetsOwnedBy(addr: EthAddress): Artifact[];
    getPlanetWithId(planetId: LocationId, updateIfStale?: boolean): Planet | undefined;
    getPlanetLevel(planetId: LocationId): PlanetLevel | undefined;
    getPlanetDetailLevel(planetId: LocationId): number | undefined;
    /**
     * received some artifact data from the contract. update our stores
     */
    replaceArtifactFromContractData(artifact: Artifact): void;
    replaceArtifactsFromContractData(artifacts: Iterable<Artifact>): void;
    /**
     * received some planet data from the contract. update our stores
     */
    replacePlanetFromContractData(planet: Planet, updatedArrivals: QueuedArrival[], updatedArtifactsOnPlanet: ArtifactId[], revealedLocation?: RevealedLocation): void;
    getPlanetWithCoords(coords: WorldCoords): Planet | undefined;
    getPlanetWithLocation(location: WorldLocation): Planet | undefined;
    isPlanetInContract(planetId: LocationId): boolean;
    /**
     * Called when we load chunk data into memory (on startup), when we're loading all revealed locations (on startup),
     * when miner has mined a new chunk while exploring, and when a planet's location is revealed onchain during the course of play
     * Adds a WorldLocation to the planetLocationMap, making it known to the player locally
     * Sets an unsynced default planet in the PlanetMap this.planets
     * IMPORTANT: This is the only way a LocatablePlanet gets constructed
     * IMPORTANT: Idempotent
     */
    addPlanetLocation(planetLocation: WorldLocation): void;
    markLocationRevealed(revealedLocation: RevealedLocation): void;
    getLocationOfPlanet(planetId: LocationId): WorldLocation | undefined;
    getAllPlanets(): Iterable<Planet>;
    getAllOwnedPlanets(): Planet[];
    getAllVoyages(): QueuedArrival[];
    onTxIntent(txIntent: TxIntent): void;
    clearUnconfirmedTxIntent(txIntent: TxIntent): void;
    getUnconfirmedMoves(): UnconfirmedMove[];
    getUnconfirmedWormholeActivations(): UnconfirmedActivateArtifact[];
    getWormholes(): Iterable<Wormhole>;
    getUnconfirmedUpgrades(): UnconfirmedUpgrade[];
    getUnconfirmedReveal(): UnconfirmedReveal | undefined;
    getUnconfirmedBuyGPTCredits(): UnconfirmedBuyGPTCredits | undefined;
    getPlanetMap(): Map<LocationId, Planet>;
    getArtifactMap(): Map<ArtifactId, Artifact>;
    getMyPlanetMap(): Map<LocationId, Planet>;
    getMyArtifactMap(): Map<ArtifactId, Artifact>;
    getRevealedLocations(): Map<LocationId, RevealedLocation>;
    /**
     * Gets the ids of all the planets that are both within the given bounding box (defined by its bottom
     * left coordinate, width, and height) in the world and of a level that was passed in via the
     * `planetLevels` parameter.
     */
    getPlanetsInWorldRectangle(worldX: number, worldY: number, worldWidth: number, worldHeight: number, levels: number[], planetLevelToRadii: Map<number, Radii>, updateIfStale?: boolean): LocatablePlanet[];
    /**
     * Set a planet into our cached store. Should ALWAYS call this when setting a planet.
     * `this.planets` and `this.myPlanets` should NEVER be accessed directly!
     * This function also handles managing planet update messages and indexing the map of owned planets.
     * @param planet the planet to set
     */
    setPlanet(planet: Planet): void;
    /**
     * Set an artifact into our cached store. Should ALWAYS call this when setting an artifact.
     * `this.artifacts` and `this.myArtifacts` should NEVER be accessed directly!
     * This function also handles managing artifact update messages and indexing the map of owned artifacts.
     * @param artifact the artifact to set
     */
    setArtifact(artifact: Artifact): void;
    processArrivalsForPlanet(planetId: LocationId, arrivals: QueuedArrival[]): ArrivalWithTimer[];
    clearOldArrivals(planet: Planet): void;
    planetLevelFromHexPerlin(hex: LocationId, perlin: number): PlanetLevel;
    spaceTypeFromPerlin(perlin: number): SpaceType;
    static getSilverNeeded(planet: Planet): number;
    static planetCanUpgrade(planet: Planet): boolean;
    planetTypeFromHexPerlin(hex: LocationId, perlin: number): PlanetType;
    getBiome(loc: WorldLocation): Biome;
    /**
     * returns the data for an unowned, untouched planet at location
     * most planets in the game are untouched and not stored in the contract,
     * so we need to generate their data optimistically in the client
     */
    defaultPlanetFromLocation(location: WorldLocation): LocatablePlanet;
    updatePlanetIfStale(planet: Planet): void;
    /**
     * returns timestamp (seconds) that planet will reach percent% of energycap
     * time may be in the past
     */
    getEnergyCurveAtPercent(planet: Planet, percent: number): number;
    /**
     * returns timestamp (seconds) that planet will reach percent% of silcap if
     * doesn't produce silver, returns undefined if already over percent% of silcap,
     * returns undefined
     */
    getSilverCurveAtPercent(planet: Planet, percent: number): number | undefined;
    /**
     * Returns the EthAddress of the player who can control the owner:
     * if the artifact is on a planet, this is the owner of the planet
     * if the artifact is on a voyage, this is the initiator of the voyage
     * if the artifact is not on either, then it is the owner of the artifact NFT
     */
    getArtifactController(artifactId: ArtifactId): EthAddress | undefined;
    calculateSilverSpent(planet: Planet): number;
    updateScore(planetId: LocationId): void;
}
