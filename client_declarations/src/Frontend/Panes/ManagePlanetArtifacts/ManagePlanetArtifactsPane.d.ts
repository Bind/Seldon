import { ModalHook } from '../../Views/ModalPane';
/**
 * This is the place where a user can manage all of their artifacts on a
 * particular planet. This includes prospecting, withdrawing, depositing,
 * activating, and deactivating artifacts.
 */
export declare function ManagePlanetArtifactsPane({ hook, setArtifactDetailsOpen, }: {
    hook: ModalHook;
    setArtifactDetailsOpen: (open: boolean) => void;
}): JSX.Element;
