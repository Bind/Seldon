import { Artifact, Planet } from '@darkforest_eth/types';
import React from 'react';
import { StatIdx } from '../../_types/global/GlobalTypes';
import { TooltipName } from '../Game/WindowManager';
export declare const StyledPlanetCard: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const PreviewSection: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const DestroyedMarker: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const PlanetTag: import("styled-components").StyledComponent<"div", any, {
    planet: Planet | undefined;
}, never>;
export declare const IconsWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const StatSection: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const ArtifactSection: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const StatRow: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const TopRow: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const StatCell: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const StyledStatIcon: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare function PCStatIcon({ planet, children, stat: stat, }: {
    planet: Planet | undefined;
    children: React.ReactNode;
    stat: StatIdx;
}): JSX.Element;
export declare const Small: import("styled-components").StyledComponent<"div", any, {
    planet: Planet | undefined;
}, never>;
export declare const BigStatCell: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const RowTip: ({ name, children }: {
    name: TooltipName;
    children: React.ReactNode;
}) => JSX.Element;
export declare const TitleBar: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare function PlanetActiveArtifact({ artifact, planet, }: {
    artifact: Artifact;
    planet: Planet | undefined;
}): JSX.Element;
