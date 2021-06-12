export declare const Underline: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Spacer: import("styled-components").StyledComponent<"div", any, {
    width?: number | undefined;
    height?: number | undefined;
}, never>;
export declare const Truncate: import("styled-components").StyledComponent<"div", any, {}, never>;
/**
 * The container element into which a plugin renders its html elements.
 * Contains styles for child elements so that plugins can use UI
 * that is consistent with the rest of Dark Forest's UI. Keeping this up
 * to date will be an ongoing challange, but there's probably some better
 * way to do this.
 */
export declare const PluginElements: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const MaxWidth: import("styled-components").StyledComponent<"div", any, {
    width: string;
}, never>;
export declare const Hidden: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Select: import("styled-components").StyledComponent<"select", any, {}, never>;
/**
 * Controllable input that allows the user to select from one of the
 * given string values.
 */
export declare function SelectFrom({ values, value, setValue, labels, }: {
    values: string[];
    value: string;
    setValue: (value: string) => void;
    labels?: string[];
}): JSX.Element;
export declare const HoverableTooltip: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const CenterRow: import("styled-components").StyledComponent<"div", any, {}, never>;
/**
 * A box which centers some darkened text. Useful for displaying
 * *somthing* instead of empty space, if there isn't something to
 * be displayed. Think of it as a placeholder.
 */
export declare const CenterBackgroundSubtext: import("styled-components").StyledComponent<"div", any, {
    width: string;
    height: string;
}, never>;
