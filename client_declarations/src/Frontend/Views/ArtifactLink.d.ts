import { Artifact } from '@darkforest_eth/types';
import React from 'react';
export declare function ArtifactLink({ artifact, setDetailsOpen, children, }: {
    artifact: Artifact;
    setDetailsOpen: (open: boolean) => void;
    children: React.ReactNode;
}): JSX.Element;
