import { Selectorizer } from "./Selectorizer";
import { ISelectOption } from "./types";
export declare class Controller {
    selectorizers: Selectorizer[];
    constructor(selectorizers: Selectorizer[]);
    open(): void;
    close(): void;
    change(newValue: string): void;
    refresh(): void;
    destroy(): void;
    addOptions(newOptions: ISelectOption[]): void;
    setOptions(newOptions: ISelectOption[]): void;
    getValues(): {
        name: string;
        value: string;
    }[];
}
