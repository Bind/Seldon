import { Artifact, ArtifactId, LocatablePlanet } from '@darkforest_eth/types';
export declare function ManageArtifactsPane({ planet, artifactsInInventory, artifactsOnPlanet, currentBlockNumber, playerAddress, openArtifactDetails, prospect, find, activate, deactivate, deposit, withdraw, }: {
    planet: LocatablePlanet;
    artifactsInInventory: Artifact[];
    artifactsOnPlanet: Array<Artifact | undefined>;
    currentBlockNumber: number | undefined;
    playerAddress: string;
    openArtifactDetails: (artifactId: ArtifactId) => void;
    prospect: () => void;
    find: () => void;
    activate: (artifact: Artifact) => void;
    deactivate: (artifact: Artifact) => void;
    deposit: (artifact: Artifact) => void;
    withdraw: (artifact: Artifact) => void;
}): JSX.Element;
