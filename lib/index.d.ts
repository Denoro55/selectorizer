import "@babel/polyfill";
import { IOptions } from "./scripts/types";
import { Controller } from "./scripts/Controller";
export declare const selectorize: ($selectElement: HTMLSelectElement | NodeListOf<HTMLSelectElement>, options?: IOptions | undefined) => Controller;
