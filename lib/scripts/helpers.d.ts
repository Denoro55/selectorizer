import { IElementDataset } from "./types";
export declare const createElement: (tag: string, cls: string[], text: string, datasetArray?: IElementDataset[]) => HTMLElement;
export declare const wrapElement: ($parent: HTMLElement, $child: HTMLElement) => void;
export declare const getOptions: ($optionsNodes: NodeList) => {
    text: string;
    value: string;
}[];
export declare const getPluginClass: (clz: string, delimiter: "__" | "-") => string;
export declare const toPx: (value: number) => string;
export declare const getClosestElement: (element: HTMLElement, clazz: string) => HTMLElement | null;
