import { SpaceType } from '@darkforest_eth/types';
export declare const ARTIFACT_ROW_H = 48;
export declare const SPACE_TYPE_COLORS: Record<SpaceType, string>;
declare const dfstyles: {
    colors: {
        text: string;
        subtext: string;
        subbertext: string;
        subbesttext: string;
        blueBackground: string;
        background: string;
        backgrounddark: string;
        backgroundlight: string;
        backgroundlighter: string;
        dfblue: string;
        dfgreen: string;
        dfred: string;
        dfyellow: string;
        artifactBackground: string;
        icons: {
            twitter: string;
            github: string;
            discord: string;
            email: string;
            blog: string;
        };
    };
    borderRadius: string;
    fontSize: string;
    fontSizeS: string;
    fontSizeXS: string;
    fontH1: string;
    fontH1S: string;
    fontH2: string;
    titleFont: string;
    screenSizeS: string;
    game: {
        terminalWidth: string;
        fontSize: string;
        canvasbg: string;
        rangecolors: {
            dash: string;
            dashenergy: string;
            colorenergy: string;
            color100: string;
            color50: string;
            color25: string;
        };
        bonuscolors: {
            energyCap: string;
            speed: string;
            def: string;
            energyGro: string;
            range: string;
        };
        toolbarHeight: string;
        terminalFontSize: string;
        styles: {
            active: string;
            animProps: string;
        };
    };
    prefabs: {
        noselect: import("styled-components").FlattenSimpleInterpolation;
    };
};
export default dfstyles;
