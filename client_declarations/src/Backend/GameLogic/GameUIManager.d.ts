import {
  LocationId,
  ArtifactId,
  EthAddress,
  Player,
  Artifact,
  Planet,
  LocatablePlanet,
  PlanetLevel,
  UpgradeBranchName,
  WorldLocation,
  WorldCoords,
  Biome,
  SpaceType,
  QueuedArrival,
  Upgrade,
  Conversation,
  UnconfirmedMove,
  UnconfirmedUpgrade,
  UnconfirmedActivateArtifact,
} from "@darkforest_eth/types";
import EventEmitter from "events";
import Viewport from "../../Frontend/Game/Viewport";
import { Monomitter } from "../../Frontend/Utils/Monomitter";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
import { ContractConstants } from "../../_types/darkforest/api/ContractsAPITypes";
import {
  ExploredChunkData,
  Rectangle,
  Wormhole,
  HashConfig,
} from "../../_types/global/GlobalTypes";
import { MiningPattern } from "../Miner/MiningPatterns";
import EthConnection from "../Network/EthConnection";
import { UIDataKey } from "../Storage/UIStateStorageManager";
import GameManager from "./GameManager";
import { PluginManager } from "./PluginManager";
import { ViewportEntities } from "./ViewportEntities";
export declare enum GameUIManagerEvent {
  InitializedPlayer = "InitializedPlayer",
  InitializedPlayerError = "InitializedPlayerError",
}
declare class GameUIManager extends EventEmitter {
  readonly radiusMap: Record<PlanetLevel, number>;
  readonly gameManager: GameManager;
  terminal: React.MutableRefObject<TerminalHandle | undefined>;
  previousSelectedPlanet: Planet | undefined;
  selectedPlanet: Planet | undefined;
  selectedCoords: WorldCoords | undefined;
  mouseDownOverPlanet: Planet | undefined;
  mouseDownOverCoords: WorldCoords | undefined;
  mouseHoveringOverPlanet: Planet | undefined;
  mouseHoveringOverCoords: WorldCoords | undefined;
  sendingPlanet: Planet | undefined;
  sendingCoords: WorldCoords | undefined;
  isSending: boolean;
  viewportEntities: ViewportEntities;
  /**
   * The Wormhole artifact requires you to choose a target planet. This value
   * indicates whether or not the player is currently selecting a target planet.
   */
  isChoosingTargetPlanet: boolean;
  onChooseTargetPlanet?: (planet: LocatablePlanet | undefined) => void;
  minerLocation: WorldCoords | undefined;
  extraMinerLocations: WorldCoords[];
  forcesSending: {
    [key: string]: number;
  };
  silverSending: {
    [key: string]: number;
  };
  artifactSending: {
    [key: string]: Artifact | undefined;
  };
  plugins: PluginManager;
  readonly selectedPlanetId$: Monomitter<LocationId | undefined>;
  readonly selectedPlanet$: Monomitter<Planet | undefined>;
  readonly hoverPlanetId$: Monomitter<LocationId | undefined>;
  readonly hoverPlanet$: Monomitter<Planet | undefined>;
  readonly selectedArtifactId$: Monomitter<ArtifactId | undefined>;
  readonly selectedArtifact$: Monomitter<Artifact | undefined>;
  readonly myArtifacts$: Monomitter<Map<ArtifactId, Artifact>>;
  constructor(
    gameManager: GameManager,
    terminalHandle: React.MutableRefObject<TerminalHandle | undefined>
  );
  static create(
    gameManager: GameManager,
    terminalHandle: React.MutableRefObject<TerminalHandle | undefined>
  ): Promise<GameUIManager>;
  destroy(): void;
  getEthConnection(): EthConnection;
  getContractAddress(): EthAddress;
  centerPlanet(planet: Planet | undefined): void;
  centerCoords(coords: WorldCoords): void;
  centerLocationId(planetId: LocationId): void;
  joinGame(beforeRetry: (e: Error) => Promise<boolean>): GameUIManager;
  addAccount(coords: WorldCoords): Promise<boolean>;
  verifyTwitter(twitter: string): Promise<boolean>;
  getPluginManager(): PluginManager;
  getPrivateKey(): string;
  getMyBalance(): number;
  getMyBalanceEmitter(): Monomitter<number>;
  findArtifact(planetId: LocationId): void;
  prospectPlanet(planetId: LocationId): void;
  withdrawArtifact(locationId: LocationId, artifactId: ArtifactId): void;
  depositArtifact(locationId: LocationId, artifactId: ArtifactId): void;
  activateArtifact(
    locationId: LocationId,
    id: ArtifactId,
    wormholeTo?: LocationId
  ): void;
  deactivateArtifact(locationId: LocationId, artifactId: ArtifactId): void;
  withdrawSilver(locationId: LocationId, amount: number): void;
  startWormholeFrom(
    planet: LocatablePlanet
  ): Promise<LocatablePlanet | undefined>;
  revealLocation(locationId: LocationId): void;
  getNextBroadcastAvailableTimestamp(): number;
  getConversation(artifactId: ArtifactId): Promise<Conversation | undefined>;
  startConversation(artifactId: ArtifactId): Promise<Conversation>;
  stepConversation(
    artifactId: ArtifactId,
    message: string
  ): Promise<Conversation>;
  getEnergyArrivingForMove(
    from: LocationId,
    to: LocationId | undefined,
    dist: number | undefined,
    energy: number
  ): number;
  getIsChoosingTargetPlanet(): boolean;
  onMouseDown(coords: WorldCoords): void;
  onMouseClick(_coords: WorldCoords): void;
  onMouseMove(coords: WorldCoords): void;
  onMouseUp(coords: WorldCoords): void;
  onMouseOut(): void;
  startExplore(): void;
  stopExplore(): void;
  setForcesSending(planetId: LocationId, percentage: number): void;
  setSilverSending(planetId: LocationId, percentage: number): void;
  setArtifactSending(planetId: LocationId, artifact?: Artifact): void;
  isOwnedByMe(planet: Planet): boolean;
  addNewChunk(chunk: ExploredChunkData): void;
  bulkAddNewChunks(chunks: ExploredChunkData[]): Promise<void>;
  setMiningPattern(pattern: MiningPattern): void;
  getMiningPattern(): MiningPattern | undefined;
  isMining(): boolean;
  getAccount(): EthAddress | undefined;
  getTwitter(address: EthAddress | undefined): string | undefined;
  getEndTimeSeconds(): number;
  getUpgrade(branch: UpgradeBranchName, level: number): Upgrade;
  getBiomeKey(biome: Biome): string;
  getDiscoverBiomeName(biome: Biome): string;
  getDistCoords(from: WorldCoords, to: WorldCoords): number;
  discoverBiome(planet: LocatablePlanet): void;
  getAllPlayers(): Player[];
  getSelectedPlanet(): Planet | undefined;
  getPreviousSelectedPlanet(): Planet | undefined;
  setSelectedId(id: LocationId): void;
  setSelectedPlanet(planet: Planet | undefined): void;
  getSelectedCoords(): WorldCoords | undefined;
  getMouseDownPlanet(): Planet | undefined;
  onSendInit(planet: Planet | undefined): void;
  onSendCancel(): void;
  hasMinedChunk(chunkLocation: Rectangle): boolean;
  getChunk(chunkFootprint: Rectangle): ExploredChunkData | undefined;
  spaceTypeFromPerlin(perlin: number): SpaceType;
  getSpaceTypePerlin(coords: WorldCoords, floor: boolean): number;
  getBiomePerlin(coords: WorldCoords, floor: boolean): number;
  onDiscoveredChunk(chunk: ExploredChunkData): void;
  getMinerLocation(): WorldCoords | undefined;
  setExtraMinerLocation(idx: number, coords: WorldCoords): void;
  removeExtraMinerLocation(idx: number): void;
  getAllMinerLocations(): WorldCoords[];
  getMouseDownCoords(): WorldCoords | undefined;
  setHoveringOverPlanet(planet: Planet | undefined): void;
  getHoveringOverPlanet(): Planet | undefined;
  getHoveringOverCoords(): WorldCoords | undefined;
  getForcesSending(planetId: LocationId): number;
  getSilverSending(planetId: LocationId): number;
  getArtifactSending(planetId: LocationId): Artifact | undefined;
  isOverOwnPlanet(coords: WorldCoords): Planet | undefined;
  getMyArtifacts(): Artifact[];
  getMyArtifactsNotOnPlanet(): Artifact[];
  getPlanetWithId(planetId: LocationId): Planet | undefined;
  getMyScore(): number;
  getArtifactWithId(artifactId: ArtifactId): Artifact | undefined;
  getPlanetWithCoords(coords: WorldCoords | undefined): Planet | undefined;
  getArtifactsWithIds(artifactIds: ArtifactId[]): Array<Artifact | undefined>;
  getArtifactPlanet(artifact: Artifact): Planet | undefined;
  getPlanetLevel(planetId: LocationId): PlanetLevel | undefined;
  getAllOwnedPlanets(): Planet[];
  getAllVoyages(): QueuedArrival[];
  getUnconfirmedMoves(): UnconfirmedMove[];
  getUnconfirmedUpgrades(): UnconfirmedUpgrade[];
  isCurrentlyRevealing(): boolean;
  getUnconfirmedWormholeActivations(): UnconfirmedActivateArtifact[];
  getWormholes(): Iterable<Wormhole>;
  getLocationOfPlanet(planetId: LocationId): WorldLocation | undefined;
  getExploredChunks(): Iterable<ExploredChunkData>;
  getLocationsAndChunks(): {
    chunks: Set<ExploredChunkData>;
    cachedPlanets: Map<
      LocationId,
      import("./ViewportEntities").PlanetRenderInfo
    >;
  };
  getIsHighPerfMode(): boolean;
  getPlanetsInViewport(): Planet[];
  getWorldRadius(): number;
  getWorldSilver(): number;
  getUniverseTotalEnergy(): number;
  getSilverOfPlayer(player: EthAddress): number;
  getEnergyOfPlayer(player: EthAddress): number;
  getWithdrawnSilverOfPlayer(player: EthAddress): number;
  upgrade(planet: Planet, branch: number): void;
  buyHat(planet: Planet): void;
  buyGPTCredits(amount: number): void;
  getGptCreditPriceEmitter(): Monomitter<number>;
  getGptCreditBalanceEmitter(): Monomitter<number>;
  getIsBuyingCreditsEmitter(): Monomitter<boolean>;
  getHomeCoords(): WorldCoords;
  getHomeHash(): LocationId | undefined;
  getHomePlanet(): Planet | undefined;
  getRadiusOfPlanetLevel(planetRarity: PlanetLevel): number;
  getEnergyCurveAtPercent(planet: Planet, percent: number): number;
  getSilverCurveAtPercent(planet: Planet, percent: number): number | undefined;
  getHashesPerSec(): number;
  generateVerificationTweet(twitter: string): Promise<string>;
  getPerlinThresholds(): [number, number, number];
  getHashConfig(): HashConfig;
  setUIDataItem(key: UIDataKey, value: number | boolean): void;
  getUIDataItem(key: UIDataKey): number | boolean;
  getViewport(): Viewport;
  getPlanetMap(): Map<LocationId, Planet>;
  getArtifactMap(): Map<ArtifactId, Artifact>;
  getMyPlanetMap(): Map<LocationId, Planet>;
  getMyArtifactMap(): Map<ArtifactId, Artifact>;
  getTerminal(): TerminalHandle | undefined;
  getContractConstants(): ContractConstants;
  updatePlanets(): void;
  updateMouseHoveringOverCoords(coords: WorldCoords): WorldCoords;
  onEmitInitializedPlayer(): void;
  onEmitInitializedPlayerError(err: React.ReactNode): void;
}
export default GameUIManager;
