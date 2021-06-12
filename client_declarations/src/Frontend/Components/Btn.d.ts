import React from 'react';
export interface BtnProps {
    disabled?: boolean;
    noBorder?: boolean;
    wide?: boolean;
    color?: string;
    borderColor?: string;
    textColor?: string;
}
export declare function Btn(props: BtnProps & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
