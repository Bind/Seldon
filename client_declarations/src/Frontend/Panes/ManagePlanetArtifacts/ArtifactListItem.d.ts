import { Artifact, ArtifactId } from '@darkforest_eth/types';
import React from 'react';
export declare function ArtifactListItem({ artifact, openArtifactDetails, actions, }: {
    artifact: Artifact | undefined;
    openArtifactDetails: (artifactId: ArtifactId) => void;
    actions: (artifact: Artifact) => React.ReactElement | undefined;
}): JSX.Element;
