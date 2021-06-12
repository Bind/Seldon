/// <reference types="node" />
import EventEmitter from 'events';
import React from 'react';
import { TxIntent, EthTxStatus, SubmittedTx, Planet, LocatablePlanet } from '@darkforest_eth/types';
import { ExploredChunkData } from '../../_types/global/GlobalTypes';
export declare enum NotificationType {
    Tx = 0,
    CanUpgrade = 1,
    BalanceEmpty = 2,
    WelcomePlayer = 3,
    FoundSpace = 4,
    FoundDeepSpace = 5,
    FoundDeadSpace = 6,
    FoundPirates = 7,
    FoundSilver = 8,
    FoundSilverBank = 9,
    FoundTradingPost = 10,
    FoundComet = 11,
    FoundArtifact = 12,
    FoundBiome = 13,
    ReceivedPlanet = 14,
    Generic = 15
}
export declare type NotificationInfo = {
    type: NotificationType;
    message: React.ReactNode;
    icon: React.ReactNode;
    id: string;
    color?: string;
    txData?: TxIntent;
    txStatus?: EthTxStatus;
};
export declare enum NotificationManagerEvent {
    Notify = "Notify"
}
declare class NotificationManager extends EventEmitter {
    static instance: NotificationManager;
    private constructor();
    static getInstance(): NotificationManager;
    private getIcon;
    notify(type: NotificationType, message: React.ReactNode): void;
    notifyTx(txData: TxIntent, message: React.ReactNode, txStatus: EthTxStatus): void;
    txInit(txIntent: TxIntent): void;
    txSubmit(tx: SubmittedTx): void;
    txConfirm(tx: SubmittedTx): void;
    unsubmittedTxFail(txIntent: TxIntent, _e: Error): void;
    txRevert(tx: SubmittedTx): void;
    welcomePlayer(): void;
    foundSpace(chunk: ExploredChunkData): void;
    foundDeepSpace(chunk: ExploredChunkData): void;
    foundDeadSpace(chunk: ExploredChunkData): void;
    foundSilver(planet: Planet): void;
    foundSilverBank(planet: Planet): void;
    foundTradingPost(planet: Planet): void;
    foundPirates(planet: Planet): void;
    foundComet(planet: Planet): void;
    foundBiome(planet: LocatablePlanet): void;
    foundArtifact(planet: LocatablePlanet): void;
    planetCanUpgrade(planet: Planet): void;
    balanceEmpty(): void;
    receivedPlanet(planet: Planet): void;
}
export default NotificationManager;
