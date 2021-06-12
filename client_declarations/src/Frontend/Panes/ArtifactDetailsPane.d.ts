import { ArtifactId, Upgrade, Artifact } from '@darkforest_eth/types';
import { Wrapper } from '../../Backend/Utils/Wrapper';
import { StatIdx } from '../../_types/global/GlobalTypes';
import { ModalHook } from '../Views/ModalPane';
import { ContractConstants } from '../../_types/darkforest/api/ContractsAPITypes';
export declare function UpgradeStatInfo({ upgrades, stat, }: {
    upgrades: (Upgrade | undefined)[];
    stat: StatIdx;
}): JSX.Element;
export declare function ArtifactDetailsBody({ artifactWrapper, contractConstants, openConversationForArtifact, }: {
    artifactWrapper: Wrapper<Artifact | undefined>;
    contractConstants: ContractConstants;
    openConversationForArtifact: (id: ArtifactId) => void;
}): JSX.Element | null;
export declare function ArtifactDetailsPane({ hook, openConversationForArtifact, }: {
    hook: ModalHook;
    openConversationForArtifact: (id: ArtifactId) => void;
}): JSX.Element;
