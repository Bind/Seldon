import { AddressTwitterMap } from '../../_types/darkforest/api/UtilityServerAPITypes';
import { EthAddress } from '@darkforest_eth/types';
export declare const WEBSERVER_URL: string;
export declare enum EmailResponse {
    Success = 0,
    Invalid = 1,
    ServerError = 2
}
export declare const submitInterestedEmail: (email: string) => Promise<EmailResponse>;
export declare const submitUnsubscribeEmail: (email: string) => Promise<EmailResponse>;
export declare const submitPlayerEmail: (email: string, ethAddress: EthAddress) => Promise<EmailResponse>;
export declare const submitWhitelistKey: (key: string, address: EthAddress) => Promise<string | null>;
export declare const requestDevFaucet: (address: EthAddress) => Promise<boolean>;
export declare const getAllTwitters: () => Promise<AddressTwitterMap>;
export declare const verifyTwitterHandle: (twitter: string, address: EthAddress) => Promise<boolean>;
