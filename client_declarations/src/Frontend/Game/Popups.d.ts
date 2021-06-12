import { EthAddress } from '@darkforest_eth/types';
import { QueuedTxRequest } from '../../Backend/Network/TxExecutor';
import EthConnection from '../../Backend/Network/EthConnection';
export declare function openConfirmationWindowForTransaction(ethConnection: EthConnection, txRequest: QueuedTxRequest, from: EthAddress, gasFeeGwei: number): Promise<void>;
