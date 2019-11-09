import {Declaration} from '../ast/types';

export type Scope = {
    current: symbol;
    globalKey: symbol;
    locals: Array<Declaration>;
    map: Map<ScopeKey, ScopeEntry>;
}

export type ScopeKey = null | symbol;

export type ScopeEntry = {
    entries: Array<Declaration>;
    parent: ScopeKey;
    key: ScopeKey;
}

export type ParsingResult = {
    obj: ParsingResultObject;
    str: string;
    pure: boolean;
}

export type ParsingResultObjectValue = string | object | null;
export type ParsingResultObject = {
    [key: string]: ParsingResultObjectValue | Array<ParsingResultObjectValue>;
}
