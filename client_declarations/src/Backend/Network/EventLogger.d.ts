export declare class EventLogger {
    static instance: EventLogger;
    static getInstance(): EventLogger;
    static augmentEvent(event: unknown): {};
    logEvent(event: unknown): void;
}
