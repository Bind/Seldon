import { EventEmitter } from "events";
import { BigInteger } from "big-integer";
import {
  ExploredChunkData,
  Rectangle,
  HashConfig,
  Wormhole,
  RevealCountdownInfo,
} from "../../_types/global/GlobalTypes";
import PersistentChunkStore from "../Storage/PersistentChunkStore";
import ContractsAPI from "./ContractsAPI";
import MinerManager from "../Miner/MinerManager";
import { ContractConstants } from "../../_types/darkforest/api/ContractsAPITypes";
import { GameObjects } from "./GameObjects";
import { Contract, ContractInterface } from "ethers";
import {
  EthAddress,
  Player,
  ArtifactId,
  VoyageId,
  LocationId,
  WorldLocation,
  WorldCoords,
  Conversation,
  PlanetLevel,
  SpaceType,
  QueuedArrival,
  Upgrade,
  Planet,
  Artifact,
  UnconfirmedUpgrade,
  TxIntent,
  UnconfirmedMove,
  UnconfirmedActivateArtifact,
  RevealedCoords,
  LocatablePlanet,
} from "@darkforest_eth/types";
import NotificationManager from "../../Frontend/Game/NotificationManager";
import { Monomitter } from "../../Frontend/Utils/Monomitter";
import UIEmitter from "../../Frontend/Utils/UIEmitter";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
import {
  MiningPattern,
  SpiralPattern,
  SwissCheesePattern,
} from "../Miner/MiningPatterns";
import EthConnection from "../Network/EthConnection";
import { SerializedPlugin } from "../Plugins/SerializedPlugin";
import { ProcgenUtils } from "../Procedural/ProcgenUtils";
import SnarkArgsHelper from "../Utils/SnarkArgsHelper";
import UIStateStorageManager, {
  UIDataKey,
} from "../Storage/UIStateStorageManager";
import { Radii } from "./ViewportEntities";
export declare enum GameManagerEvent {
  PlanetUpdate = "PlanetUpdate",
  DiscoveredNewChunk = "DiscoveredNewChunk",
  InitializedPlayer = "InitializedPlayer",
  InitializedPlayerError = "InitializedPlayerError",
  ArtifactUpdate = "ArtifactUpdate",
  Moved = "Moved",
}
declare class GameManager extends EventEmitter {
  // @ts-expect-error
  readonly terminal: React.MutableRefObject<TerminalHandle | undefined>;
  readonly account: EthAddress | undefined;
  readonly players: Map<string, Player>;
  readonly contractsAPI: ContractsAPI;
  readonly persistentChunkStore: PersistentChunkStore;
  readonly snarkHelper: SnarkArgsHelper;
  readonly entityStore: GameObjects;
  readonly useMockHash: boolean;
  readonly contractConstants: ContractConstants;
  readonly endTimeSeconds: number;
  readonly ethConnection: EthConnection;
  readonly hashConfig: HashConfig;
  readonly planetHashMimc: (...inputs: number[]) => BigInteger;
  readonly uiStateStorageManager: UIStateStorageManager;
  balance: number;
  myBalance$: Monomitter<number>;
  balanceInterval: ReturnType<typeof setInterval>;
  minerManager?: MinerManager;
  hashRate: number;
  homeLocation: WorldLocation | undefined;
  worldRadius: number;
  gptCreditPriceEther: number;
  gptCreditPriceEtherEmitter$: Monomitter<number>;
  myGPTCredits: number;
  myGPTCredits$: Monomitter<number>;
  get planetRarity(): number;
  constructor(
    // @ts-expect-error
    terminal: React.MutableRefObject<TerminalHandle | undefined>,
    account: EthAddress | undefined,
    balance: number,
    players: Map<string, Player>,
    touchedPlanets: Map<LocationId, Planet>,
    allTouchedPlanetIds: Set<LocationId>,
    revealedCoords: Map<LocationId, RevealedCoords>,
    worldRadius: number,
    unprocessedArrivals: Map<VoyageId, QueuedArrival>,
    unprocessedPlanetArrivalIds: Map<LocationId, VoyageId[]>,
    contractsAPI: ContractsAPI,
    contractConstants: ContractConstants,
    persistentChunkStore: PersistentChunkStore,
    snarkHelper: SnarkArgsHelper,
    homeLocation: WorldLocation | undefined,
    useMockHash: boolean,
    artifacts: Map<ArtifactId, Artifact>,
    ethConnection: EthConnection,
    gptCreditPriceEther: number,
    myGPTCredits: number,
    uiStateStorageManager: UIStateStorageManager
  );
  getEthConnection(): EthConnection;
  destroy(): void;
  static create(
    ethConnection: EthConnection,
    // @ts-expect-error
    terminal: React.MutableRefObject<TerminalHandle | undefined>
  ): Promise<GameManager>;
  hardRefreshPlayer(address: EthAddress): Promise<void>;
  hardRefreshPlanet(planetId: LocationId): Promise<void>;
  bulkHardRefreshPlanets(planetIds: LocationId[]): Promise<void>;
  hardRefreshArtifact(artifactId: ArtifactId): Promise<void>;
  refreshMyGPTCredits(): Promise<void>;
  onTxIntentFail(txIntent: TxIntent, e: Error): void;
  setUIDataItem(key: UIDataKey, value: number | boolean): void;
  getUIDataItem(key: UIDataKey): number | boolean;
  getGptCreditPriceEmitter(): Monomitter<number>;
  getGptCreditBalanceEmitter(): Monomitter<number>;
  /**
   * Gets the address of the player logged into this game manager.
   */
  getAccount(): EthAddress | undefined;
  /**
   * Gets the address of the `DarkForestCore` contract, which is essentially
   * the 'backend' of the game.
   */
  getContractAddress(): EthAddress;
  /**
   * Gets the twitter handle of the given ethereum account which is associated
   * with Dark Forest.
   */
  getTwitter(address: EthAddress | undefined): string | undefined;
  /**
   * The game ends at a particular time in the future - get this time measured
   * in seconds from the epoch.
   */
  getEndTimeSeconds(): number;
  /**
   * Gets the rarity of planets in the universe
   */
  getPlanetRarity(): number;
  /**
   * returns timestamp (seconds) that planet will reach percent% of energycap
   * time may be in the past
   */
  getEnergyCurveAtPercent(planet: Planet, percent: number): number;
  /**
   * returns timestamp (seconds) that planet will reach percent% of silcap if
   * doesn't produce silver, returns undefined if already over percent% of silcap,
   */
  getSilverCurveAtPercent(planet: Planet, percent: number): number | undefined;
  /**
   * Returns the upgrade that would be applied to a planet given a particular
   * upgrade branch (defense, range, speed) and level of upgrade.
   */
  getUpgrade(branch: number, level: number): Upgrade;
  /**
   * Gets a list of all the players in the game (not just the ones you've
   * encounterd)
   */
  getAllPlayers(): Player[];
  /**
   * Gets all the map chunks that this client is aware of. Chunks may have come from
   * mining, or from importing map data.
   */
  getExploredChunks(): Iterable<ExploredChunkData>;
  /**
   * Gets the ids of all the planets that are both within the given bounding box (defined by its bottom
   * left coordinate, width, and height) in the world and of a level that was passed in via the
   * `planetLevels` parameter.
   */
  getPlanetsInWorldRectangle(
    worldX: number,
    worldY: number,
    worldWidth: number,
    worldHeight: number,
    levels: number[],
    planetLevelToRadii: Map<number, Radii>,
    updateIfStale?: boolean
  ): LocatablePlanet[];
  /**
   * Gets the radius of the playable area of the universe.
   */
  getWorldRadius(): number;
  /**
   * Gets the total amount of silver that lives on a planet that somebody owns.
   */
  getWorldSilver(): number;
  /**
   * Gets the total amount of energy that lives on a planet that somebody owns.
   */
  getUniverseTotalEnergy(): number;
  /**
   * Gets the total amount of silver that lives on planets that the given player owns.
   */
  getSilverOfPlayer(player: EthAddress): number;
  /**
   * Gets the total amount of energy that lives on planets that the given player owns.
   */
  getEnergyOfPlayer(player: EthAddress): number;
  getWithdrawnSilverOfPlayer(addr: EthAddress): number;
  initMiningManager(homeCoords: WorldCoords): void;
  /**
   * Sets the mining pattern of the miner. This kills the old miner and starts this one.
   */
  setMiningPattern(pattern: MiningPattern): void;
  /**
   * Gets the mining pattern that the miner is currently using.
   */
  getMiningPattern(): MiningPattern | undefined;
  /**
   * Set the amount of cores to mine the universe with. More cores equals faster!
   */
  setMinerCores(nCores: number): void;
  /**
   * Whether or not the miner is currently exploring space.
   */
  isMining(): boolean;
  /**
   * Changes the amount of move snark proofs that are cached.
   */
  setSnarkCacheSize(size: number): void;
  /**
   * Gets the rectangle bounding the chunk that the miner is currently in the process
   * of hashing.
   */
  getCurrentlyExploringChunk(): Rectangle | undefined;
  /**
   * Whether or not this client has successfully found and landed on a home planet.
   */
  hasJoinedGame(): boolean;
  /**
   * Returns info about the next time you can broadcast coordinates
   */
  getNextRevealCountdownInfo(): RevealCountdownInfo;
  /**
   * gets both deposited artifacts that are on planets i own as well as artifacts i own
   */
  getMyArtifacts(): Artifact[];
  /**
   * Gets the planet that is located at the given coordinates. Returns undefined if not a valid
   * location or if no planet exists at location. If the planet needs to be updated (because
   * some time has passed since we last updated the planet), then updates that planet first.
   */
  getPlanetWithCoords(coords: WorldCoords): Planet | undefined;
  /**
   * Gets the planet with the given hash. Returns undefined if the planet is neither in the contract
   * nor has been discovered locally. If the planet needs to be updated (because some time has
   * passed since we last updated the planet), then updates that planet first.
   */
  getPlanetWithId(planetId: LocationId | undefined): Planet | undefined;
  getStalePlanetWithId(planetId: LocationId): Planet | undefined;
  /**
   * Get the score of the currently logged-in account.
   */
  getMyScore(): number;
  /**
   * Gets the artifact with the given id. Null if no artifact with id exists.
   */
  getArtifactWithId(artifactId: ArtifactId): Artifact | undefined;
  /**
   * Gets the artifacts with the given ids, including ones we know exist but haven't been loaded,
   * represented by `undefined`.
   */
  getArtifactsWithIds(artifactIds: ArtifactId[]): Array<Artifact | undefined>;
  /**
   * Gets the level of the given planet. Returns undefined if the planet does not exist. Does
   * NOT update the planet if the planet is stale, which means this function is fast.
   */
  getPlanetLevel(planetId: LocationId): PlanetLevel | undefined;
  /**
   * Gets the location of the given planet. Returns undefined if the planet does not exist, or if
   * we do not know the location of this planet NOT update the planet if the planet is stale,
   * which means this function is fast.
   */
  getLocationOfPlanet(planetId: LocationId): WorldLocation | undefined;
  /**
   * Gets all voyages that have not completed.
   */
  getAllVoyages(): QueuedArrival[];
  /**
   * Gets all planets. This means all planets that are in the contract, and also all
   * planets that have been mined locally. Does not update planets if they are stale.
   * NOT PERFORMANT - for scripting only.
   */
  getAllPlanets(): Iterable<Planet>;
  /**
   * Gets a list of planets that have an owner.
   */
  getAllOwnedPlanets(): Planet[];
  /**
   * Gets a list of the planets that the player logged into this `GameManager` owns.
   */
  getMyPlanets(): Planet[];
  /**
   * Gets a map of all location IDs whose coords have been publicly revealed
   */
  // @ts-expect-error
  getRevealedLocations(): Map<LocationId, RevealedLocation>;
  /**
   * Each coordinate lives in a particular type of space, determined by a smooth random
   * function called 'perlin noise.
   */
  spaceTypeFromPerlin(perlin: number): SpaceType;
  /**
   * Gets the amount of hashes per second that the miner manager is calculating.
   */
  getHashesPerSec(): number;
  /**
   * Signs the given twitter handle with the key of the current user. Used to
   * verify that the person who owns the Dark Forest account was the one that attempted
   * to link a twitter to their account.
   */
  getSignedTwitter(twitter: string): Promise<string>;
  /**
   * Gets the key of the burner wallet used by this account.
   */
  getPrivateKey(): string;
  /**
   * Gets the balance of the account
   */
  getMyBalance(): number;
  getMyBalanceEmitter(): Monomitter<number>;
  /**
   * Gets all moves that this client has queued to be uploaded to the contract, but
   * have not been successfully confirmed yet.
   */
  getUnconfirmedMoves(): UnconfirmedMove[];
  /**
   * Gets all upgrades that this client has queued to be uploaded to the contract, but
   * have not been successfully confirmed yet.
   */
  getUnconfirmedUpgrades(): UnconfirmedUpgrade[];
  getUnconfirmedWormholeActivations(): UnconfirmedActivateArtifact[];
  getWormholes(): Iterable<Wormhole>;
  /**
   * Gets the location of your home planet.
   */
  getHomeCoords(): WorldCoords | undefined;
  /**
   * Gets the hash of the location of your home planet.
   */
  getHomeHash(): LocationId | undefined;
  /**
   * Gets the HASH CONFIG
   */
  getHashConfig(): HashConfig;
  /**
   * Whether or not the given rectangle has been mined.
   */
  hasMinedChunk(chunkLocation: Rectangle): boolean;
  getChunk(chunkFootprint: Rectangle): ExploredChunkData | undefined;
  getChunkStore(): PersistentChunkStore;
  /**
   * The perlin value at each coordinate determines the space type. There are four space
   * types, which means there are four ranges on the number line that correspond to
   * each space type. This function returns the boundary values between each of these
   * four ranges: `PERLIN_THRESHOLD_1`, `PERLIN_THRESHOLD_2`, `PERLIN_THRESHOLD_3`.
   */
  getPerlinThresholds(): [number, number, number];
  /**
   * Starts the miner.
   */
  startExplore(): void;
  /**
   * Stops the miner.
   */
  stopExplore(): void;
  setRadius(worldRadius: number): void;
  refreshTwitters(): Promise<void>;
  /**
   * Once you have posted the verificatoin tweet - complete the twitter-account-linking
   * process by telling the Dark Forest webserver to look at that tweet.
   */
  verifyTwitter(twitter: string): Promise<boolean>;
  checkGameHasEnded(): boolean;
  /**
   * Gets the timestamp (ms) of the next time that we can broadcast the coordinates of a planet.
   */
  getNextBroadcastAvailableTimestamp(): number;
  /**
   * Reveals a planet's location on-chain.
   */
  revealLocation(planetId: LocationId): GameManager;
  /**
   * Attempts to join the game. Should not be called once you've already joined.
   */
  joinGame(beforeRetry: (e: Error) => Promise<boolean>): GameManager;
  /**
   *
   * computes the WorldLocation object corresponding to a set of coordinates
   * very slow since it actually calculates the hash; do not use in render loop
   */
  locationFromCoords(coords: WorldCoords): WorldLocation;
  /**
   * Initializes a new player's game to start at the given home planet. Must have already
   * initialized the player on the contract.
   */
  addAccount(coords: WorldCoords): Promise<boolean>;
  getRandomHomePlanetCoords(): Promise<WorldLocation>;
  prospectPlanet(
    planetId: LocationId,
    bypassChecks?: boolean
  ): Promise<this | undefined>;
  /**
   * Calls the contract to find an artifact on the given planet.
   */
  findArtifact(planetId: LocationId, bypassChecks?: boolean): GameManager;
  getContractConstants(): ContractConstants;
  /**
   * Submits a transaction to the blockchain to deposit an artifact on a given planet.
   * You must own the planet and you must own the artifact directly (can't be locked in contract)
   */
  depositArtifact(
    locationId: LocationId,
    artifactId: ArtifactId,
    bypassChecks?: boolean
  ): GameManager;
  /**
   * Withdraws the artifact that is locked up on the given planet.
   */
  withdrawArtifact(
    locationId: LocationId,
    artifactId: ArtifactId,
    bypassChecks?: boolean
  ): GameManager;
  activateArtifact(
    locationId: LocationId,
    artifactId: ArtifactId,
    wormholeTo: LocationId | undefined,
    bypassChecks?: boolean
  ): this;
  deactivateArtifact(
    locationId: LocationId,
    artifactId: ArtifactId,
    bypassChecks?: boolean
  ): this | undefined;
  withdrawSilver(
    locationId: LocationId,
    amount: number,
    bypassChecks?: boolean
  ): this | undefined;
  /**
   * Submits a transaction to the blockchain to move the given amount of resources from
   * the given planet to the given planet.
   */
  move(
    from: LocationId,
    to: LocationId,
    forces: number,
    silver: number,
    artifactMoved?: ArtifactId,
    bypassChecks?: boolean
  ): GameManager;
  /**
   * Submits a transaction to the blockchain to upgrade the given planet with the given
   * upgrade branch. You must own the planet, and have enough silver on it to complete
   * the upgrade.
   */
  upgrade(
    planetId: LocationId,
    branch: number,
    _bypassChecks?: boolean
  ): GameManager;
  /**
   * Submits a transaction to the blockchain to buy a hat for the given planet. You
   * must own the planet. Warning costs real xdai. Hats are permanently locked to a
   * planet. They are purely cosmetic and a great way to BM your opponents or just
   * look your best. Just like in the real world, more money means more hat.
   */
  buyHat(planetId: LocationId, _bypassChecks?: boolean): GameManager;
  transferOwnership(
    planetId: LocationId,
    newOwner: EthAddress,
    bypassChecks?: boolean
  ): GameManager;
  buyGPTCredits(amount: number): this;
  handleTxIntent(txIntent: TxIntent): void;
  getIsBuyingCreditsEmitter(): Monomitter<boolean>;
  /**
   * Gets the GPT conversation with an artifact; undefined if there is none so far
   */
  getConversation(artifactId: ArtifactId): Promise<Conversation | undefined>;
  /**
   * Starts a GPT conversation with an artifact
   */
  startConversation(artifactId: ArtifactId): Promise<Conversation>;
  /**
   * Sends a message to an artifact you are having a GPT conversation with
   */
  stepConversation(
    artifactId: ArtifactId,
    message: string
  ): Promise<Conversation>;
  /**
   * Makes this game manager aware of a new chunk - which includes its location, size,
   * as well as all of the planets contained in that chunk. Causes the client to load
   * all of the information about those planets from the blockchain.
   */
  addNewChunk(chunk: ExploredChunkData): GameManager;
  /**
   * To add multiple chunks at once, use this function rather than `addNewChunk`, in order
   * to load all of the associated planet data in an efficient manner.
   */
  bulkAddNewChunks(chunks: ExploredChunkData[]): Promise<void>;
  /**
   * Gets the maximuim distance that you can send your energy from the given planet,
   * using the given percentage of that planet's current silver.
   */
  getMaxMoveDist(planetId: LocationId, sendingPercent: number): number;
  /**
   * Gets the distance between two planets. Throws an exception if you don't
   * know the location of either planet.
   */
  getDist(fromId: LocationId, toId: LocationId): number;
  /**
   * Gets the distance between two coordinates in space.
   */
  getDistCoords(fromCoords: WorldCoords, toCoords: WorldCoords): number;
  /**
   * Gets all the planets that you can reach with at least 1 energy from
   * the given planet.
   */
  getPlanetsInRange(planetId: LocationId, sendingPercent: number): Planet[];
  /**
   * Gets the amount of energy needed in order for a voyage from the given to the given
   * planet to arrive with your desired amount of energy.
   */
  getEnergyNeededForMove(
    fromId: LocationId,
    toId: LocationId,
    arrivingEnergy: number
  ): number;
  /**
   * Gets the amount of energy that would arrive if a voyage with the given parameters
   * was to occur. The toPlanet is optional, in case you want an estimate that doesn't include
   * wormhole speedups.
   */
  getEnergyArrivingForMove(
    fromId: LocationId,
    toId: LocationId | undefined,
    distance: number | undefined,
    sentEnergy: number
  ): number;
  /**
   * Gets the active artifact on this planet, if one exists.
   */
  getActiveArtifact(planet: Planet): Artifact | undefined;
  /**
   * If there's an active artifact on either of these planets which happens to be a wormhole which
   * is active and targetting the other planet, return the wormhole boost which is greater. Values
   * represent a multiplier.
   */
  getWormholeFactors(
    fromPlanet: Planet,
    toPlanet: Planet
  ):
    | {
        distanceFactor: number;
        speedFactor: number;
      }
    | undefined;
  /**
   * Gets the amount of time, in seconds that a voyage between from the first to the
   * second planet would take.
   */
  getTimeForMove(fromId: LocationId, toId: LocationId): number;
  /**
   * Gets the temperature of a given location.
   */
  getTemperature(coords: WorldCoords): number;
  /**
   * Load the serialized versions of all the plugins that this player has.
   */
  loadPlugins(): Promise<SerializedPlugin[]>;
  /**
   * Overwrites all the saved plugins to equal the given array of plugins.
   */
  savePlugins(savedPlugins: SerializedPlugin[]): Promise<void>;
  /**
   * Whether or not the given planet is capable of minting an artifact.
   */
  isPlanetMineable(p: Planet): boolean;
  /**
   * Returns constructors of classes that may be useful for developing plugins.
   */
  getConstructors(): {
    MinerManager: typeof MinerManager;
    SpiralPattern: typeof SpiralPattern;
    SwissCheesePattern: typeof SwissCheesePattern;
  };
  /**
   * Gets the perlin value at the given location in the world. SpaceType is based
   * on this value.
   */
  spaceTypePerlin(coords: WorldCoords, floor: boolean): number;
  /**
   * Gets the biome perlin valie at the given location in the world.
   */
  biomebasePerlin(coords: WorldCoords, floor: boolean): number;
  /**
   * Helpful functions for getting the names, descriptions, and colors of in-game entities.
   */
  getProcgenUtils(): typeof ProcgenUtils;
  /**
   * Helpful for listening to user input events.
   */
  getUIEventEmitter(): UIEmitter;
  getNotificationsManager(): NotificationManager;
  /** Return a reference to the planet map */
  getPlanetMap(): Map<LocationId, Planet>;
  /** Return a reference to the artifact map */
  getArtifactMap(): Map<ArtifactId, Artifact>;
  /** Return a reference to the map of my planets */
  getMyPlanetMap(): Map<LocationId, Planet>;
  /** Return a reference to the map of my artifacts */
  getMyArtifactMap(): Map<ArtifactId, Artifact>;
  getPlanetUpdated$(): Monomitter<LocationId>;
  getArtifactUpdated$(): Monomitter<ArtifactId>;
  getMyPlanetsUpdated$(): Monomitter<Map<LocationId, Planet>>;
  getMyArtifactsUpdated$(): Monomitter<Map<ArtifactId, Artifact>>;
  loadContract(
    contractAddress: string,
    contractABI: ContractInterface
  ): Promise<Contract>;
}
export default GameManager;
