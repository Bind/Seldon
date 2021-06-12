export declare enum EmailCTAMode {
    SUBSCRIBE = 0,
    UNSUBSCRIBE = 1
}
export declare const EmailCTA: ({ mode }: {
    mode: EmailCTAMode;
}) => JSX.Element;
