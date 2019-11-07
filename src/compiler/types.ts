import {DeclarationValue} from '../ast/types';

// TODO: Remove null as key for anonym types
export type Scope = Map<string | null, DeclarationValue>;

export type ParsingResult = {
    obj: ParsingResultObject;
    str: string;
    pure: boolean;
}

export type ParsingResultObjectValue = string | object | null;
export type ParsingResultObject = {
    [key: string]: ParsingResultObjectValue | Array<ParsingResultObjectValue>;
}

