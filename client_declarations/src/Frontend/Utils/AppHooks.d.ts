/// <reference types="react" />
import GameUIManager from '../../Backend/GameLogic/GameUIManager';
import { Wrapper } from '../../Backend/Utils/Wrapper';
import { EthAddress, Planet, ArtifactId, Artifact, AggregateLeaderboard } from '@darkforest_eth/types';
export declare const useUIManager: () => GameUIManager, UIManagerProvider: import("react").Provider<GameUIManager>;
export declare const useTopLevelDiv: () => HTMLDivElement, TopLevelDivProvider: import("react").Provider<HTMLDivElement>;
/**
 * Get the currently used account on the client.
 * @param uiManager instance of GameUIManager
 */
export declare function useAccount(uiManager: GameUIManager): EthAddress | undefined;
export declare function useTwitter(account: EthAddress | undefined, uiManager: GameUIManager): string | undefined;
/**
 * Create a subscription to the currently selected planet.
 * @param uiManager instance of GameUIManager
 */
export declare function useSelectedPlanet(uiManager: GameUIManager): Wrapper<Planet | undefined>;
/**
 * Create a subscription to the currently hovering planet.
 * @param uiManager instance of GameUIManager
 */
export declare function useHoverPlanet(uiManager: GameUIManager): Wrapper<Planet | undefined>;
export declare function useMyArtifacts(uiManager: GameUIManager): Wrapper<Map<ArtifactId, Artifact> | undefined>;
export declare function usePlanetArtifacts(planet: Wrapper<Planet | undefined>, uiManager: GameUIManager): Artifact[];
export declare function usePlanetInactiveArtifacts(planet: Wrapper<Planet | undefined>, uiManager: GameUIManager): Artifact[];
export declare function useActiveArtifact(planet: Wrapper<Planet | undefined>, uiManager: GameUIManager): Artifact | undefined;
/**
 * Create a subscription to the currently selected artifact.
 * @param uiManager instance of GameUIManager
 */
export declare function useSelectedArtifact(uiManager: GameUIManager): Wrapper<Artifact | undefined>;
/** Return a bool that indicates if the control key is pressed. */
export declare function useControlDown(): boolean;
/** Loads the leaderboard */
export declare function useLeaderboard(poll?: number | undefined): {
    leaderboard: AggregateLeaderboard | undefined;
    error: Error | undefined;
};
