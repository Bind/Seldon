import React from 'react';
import { Hook } from '../../_types/global/GlobalTypes';
import { PaneProps } from '../Components/GameWindowComponents';
export declare const RECOMMENDED_WIDTH = "450px";
export declare type ModalHook = Hook<boolean>;
export declare enum ModalName {
    Help = 0,
    PlanetDetails = 1,
    Leaderboard = 2,
    PlanetDex = 3,
    UpgradeDetails = 4,
    TwitterVerify = 5,
    TwitterBroadcast = 6,
    Hats = 7,
    Settings = 8,
    YourArtifacts = 9,
    ManageArtifacts = 10,
    Plugins = 11,
    WithdrawSilver = 12,
    ArtifactConversation = 13,
    ArtifactDetails = 14,
    MapShare = 15,
    ManageAccount = 16,
    Onboarding = 17,
    Private = 18
}
export declare function ModalPane({ children, title, hook: [visible, setVisible], hideClose, style, noPadding, helpContent, width, borderColor, backgroundColor, titlebarColor, }: PaneProps & {
    hook: Hook<boolean>;
    name?: ModalName;
    hideClose?: boolean;
    style?: React.CSSProperties;
    noPadding?: boolean;
    helpContent?: () => React.ReactNode;
    width?: string;
    borderColor?: string;
    backgroundColor?: string;
    titlebarColor?: string;
}): JSX.Element;
