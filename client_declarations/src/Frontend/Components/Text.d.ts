import React from 'react';
import { SubmittedTx, Planet, ArtifactId, WorldCoords } from '@darkforest_eth/types';
import { ExploredChunkData } from '../../_types/global/GlobalTypes';
interface TextProps {
    children: React.ReactNode;
    size?: string;
    style?: React.CSSProperties;
}
export declare function Text({ children, size, style }: TextProps): JSX.Element;
export declare function Title({ children }: {
    children: React.ReactNode;
}): JSX.Element;
export declare function Header({ children, style, }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
}): JSX.Element;
interface LinkProps extends TextProps {
    href?: string;
    to?: string;
}
export declare function Link({ href, to, children, size, style }: LinkProps): JSX.Element;
export declare const Paragraph: import("styled-components").StyledComponent<"p", any, {}, never>;
export declare const List: import("styled-components").StyledComponent<"ul", any, {}, never>;
export declare const Item: import("styled-components").StyledComponent<"li", any, {}, never>;
export declare function BlinkCursor(): JSX.Element;
export declare const Green: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Sub: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Subber: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const White: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Red: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Gold: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Colored: import("styled-components").StyledComponent<"span", any, {
    color: string;
}, never>;
export declare const Blue: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Invisible: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Smaller: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const FakeLine: () => JSX.Element;
export declare function Space({ length }: {
    length: number;
}): JSX.Element;
export declare const Tab: () => JSX.Element;
export declare const HideSmall: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const BasicLink: import("styled-components").StyledComponent<"u", any, {}, never>;
export declare function TxLink({ tx }: {
    tx: SubmittedTx;
}): JSX.Element;
export declare function CenterPlanetLink({ planet, children, }: {
    planet: Planet;
    children: React.ReactNode;
}): JSX.Element;
export declare const StyledLink: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare function ArtifactNameLink({ id }: {
    id: ArtifactId;
}): JSX.Element;
export declare function PlanetNameLink({ planet }: {
    planet: Planet;
}): JSX.Element;
export declare function CenterChunkLink({ chunk, children, }: {
    chunk: ExploredChunkData;
    children: React.ReactNode;
}): JSX.Element;
export declare function FAQ04Link({ children }: {
    children: React.ReactNode;
}): JSX.Element;
export declare const LongDash: () => JSX.Element;
export declare const Coords: ({ coords: { x, y } }: {
    coords: WorldCoords;
}) => JSX.Element;
export {};
