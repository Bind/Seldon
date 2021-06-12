import React from 'react';
import { Artifact, ArtifactId, Upgrade } from '@darkforest_eth/types';
export declare function ArtifactsList({ artifacts, sortBy, openArtifactDetails, actions, }: {
    artifacts: Array<Artifact | undefined>;
    sortBy: keyof Upgrade | undefined;
    openArtifactDetails: (artifactId: ArtifactId) => void;
    actions: (artifact: Artifact) => React.ReactElement | undefined;
}): JSX.Element;
