import { UpgradeBranches } from '@darkforest_eth/types';
import { BigNumber as EthersBN } from 'ethers';
export declare enum ZKArgIdx {
    PROOF_A = 0,
    PROOF_B = 1,
    PROOF_C = 2,
    DATA = 3
}
export declare enum InitArgIdxs {
    LOCATION_ID = 0,
    PERLIN = 1,
    RADIUS = 2,
    PLANETHASH_KEY = 3,
    SPACETYPE_KEY = 4,
    PERLIN_LENGTH_SCALE = 5,
    PERLIN_MIRROR_X = 6,
    PERLIN_MIRROR_Y = 7
}
export declare enum MoveArgIdxs {
    FROM_ID = 0,
    TO_ID = 1,
    TO_PERLIN = 2,
    TO_RADIUS = 3,
    DIST_MAX = 4,
    PLANETHASH_KEY = 5,
    SPACETYPE_KEY = 6,
    PERLIN_LENGTH_SCALE = 7,
    PERLIN_MIRROR_X = 8,
    PERLIN_MIRROR_Y = 9,
    SHIPS_SENT = 10,
    SILVER_SENT = 11,
    ARTIFACT_SENT = 12
}
export declare enum UpgradeArgIdxs {
    LOCATION_ID = 0,
    UPGRADE_BRANCH = 1
}
export declare enum ContractEvent {
    PlayerInitialized = "PlayerInitialized",
    ArrivalQueued = "ArrivalQueued",
    PlanetUpgraded = "PlanetUpgraded",
    PlanetHatBought = "PlanetHatBought",
    PlanetTransferred = "PlanetTransferred",
    LocationRevealed = "LocationRevealed",
    ArtifactFound = "ArtifactFound",
    ArtifactDeposited = "ArtifactDeposited",
    ArtifactWithdrawn = "ArtifactWithdrawn",
    ArtifactActivated = "ArtifactActivated",
    ArtifactDeactivated = "ArtifactDeactivated",
    PlanetSilverWithdrawn = "PlanetSilverWithdrawn",
    ChangedGPTCreditPrice = "ChangedCreditPrice"
}
export declare enum ContractsAPIEvent {
    PlayerUpdate = "PlayerUpdate",
    PlanetUpdate = "PlanetUpdate",
    ArrivalQueued = "ArrivalQueued",
    ArtifactUpdate = "ArtifactUpdate",
    RadiusUpdated = "RadiusUpdated",
    LocationRevealed = "LocationRevealed",
    ChangedGPTCreditPrice = "ChangedCreditPrice",
    TxInitFailed = "TxInitFailed",
    TxSubmitted = "TxSubmitted",
    TxConfirmed = "TxConfirmed",
    TxReverted = "TxReverted",
    PlanetTransferred = "PlanetTransferred"
}
export declare type UpgradeArgs = [string, string];
export declare type MoveArgs = [[string, string], // proofA
[[string, string], [string, string]], [string, string], // proofC
[string, // from locationID (BigInt)
string, // to locationID (BigInt)
string, // perlin at to
string, // radius at to
string, // distMax
string, // planetHashKey
string, // spaceTypeKey
string, // perlin lengthscale
string, // perlin xmirror (1 true, 0 false)
string, // perlin ymirror (1 true, 0 false)
string, // ships sent
string, // silver sent
string]];
export declare type DepositArtifactArgs = [string, string];
export declare type WithdrawArtifactArgs = [string, string];
export declare type PlanetTypeWeights = [number, number, number, number, number];
export declare type PlanetTypeWeightsByLevel = [PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights, PlanetTypeWeights];
export declare type PlanetTypeWeightsBySpaceType = [PlanetTypeWeightsByLevel, PlanetTypeWeightsByLevel, PlanetTypeWeightsByLevel, PlanetTypeWeightsByLevel];
export interface ContractConstants {
    DISABLE_ZK_CHECKS: boolean;
    PLANETHASH_KEY: number;
    SPACETYPE_KEY: number;
    BIOMEBASE_KEY: number;
    PERLIN_LENGTH_SCALE: number;
    PERLIN_MIRROR_X: boolean;
    PERLIN_MIRROR_Y: boolean;
    MAX_NATURAL_PLANET_LEVEL: number;
    TIME_FACTOR_HUNDREDTHS: number;
    /**
     * The perlin value at each coordinate determines the space type. There are four space
     * types, which means there are four ranges on the number line that correspond to
     * each space type. This function returns the boundary values between each of these
     * four ranges: `PERLIN_THRESHOLD_1`, `PERLIN_THRESHOLD_2`, `PERLIN_THRESHOLD_3`.
     */
    PERLIN_THRESHOLD_1: number;
    PERLIN_THRESHOLD_2: number;
    PERLIN_THRESHOLD_3: number;
    INIT_PERLIN_MIN: number;
    INIT_PERLIN_MAX: number;
    BIOME_THRESHOLD_1: number;
    BIOME_THRESHOLD_2: number;
    PLANET_RARITY: number;
    PLANET_TYPE_WEIGHTS: PlanetTypeWeightsBySpaceType;
    PHOTOID_ACTIVATION_DELAY: number;
    LOCATION_REVEAL_COOLDOWN: number;
    defaultPopulationCap: number[];
    defaultPopulationGrowth: number[];
    defaultSilverCap: number[];
    defaultSilverGrowth: number[];
    defaultRange: number[];
    defaultSpeed: number[];
    defaultDefense: number[];
    defaultBarbarianPercentage: number[];
    planetLevelThresholds: number[];
    planetCumulativeRarities: number[];
    upgrades: UpgradeBranches;
}
export declare type ClientMockchainData = null | undefined | number | string | boolean | EthersBN | ClientMockchainData[] | {
    [key in string | number]: ClientMockchainData;
};
export declare enum PlanetEventType {
    ARRIVAL = 0
}
