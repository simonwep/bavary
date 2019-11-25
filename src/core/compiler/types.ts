import {DeclarationValue} from '../ast/types';

export type ScopeEntryKey = string | symbol;
export type ScopeEntriesMap = Map<string, ScopeEntry>;
export type ScopeVariantsMap = Map<symbol, ScopeEntryVariant>;

export type ScopeEntryVariant = {
    type: 'entries' /* Exported */ | 'scope' /* Block Declaration */ | 'value';
    value: ScopeEntriesMap | Scope | DeclarationValue;
}

export type ScopeEntry = {
    type: 'scope' /* Block Declaration */ | 'value';
    value: Scope | DeclarationValue;
}

export type Scope = {
    variants: ScopeVariantsMap;
    entries: ScopeEntriesMap;
    parent: Scope | null;
    key: ScopeEntryKey;
}

export type ParsingResult = {
    obj: ParsingResultObject;
    str: string;
    pure: boolean;
}

export type ParsingResultObjectValue = string | number | object | null;
export type ParsingResultObject = {
    [key: string]: ParsingResultObjectValue | Array<ParsingResultObjectValue>;
}

export type Parser = (content: string) => null | object;
