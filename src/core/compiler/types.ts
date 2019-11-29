import {DeclarationValue} from '../ast/types';
import {Streamable}       from '../stream';

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

export type ParserArgs<DeclarationType> = {
    config: CompilerConfig;
    stream: Streamable<string>;
    decl: DeclarationType;
    scope: Scope;
    result: ParsingResult;
}

export type ParsingResultObjectValue = string | number | object | null;
export type ParsingResultObject = {
    [key: string]: ParsingResultObjectValue | Array<ParsingResultObjectValue>;
}

export type Parser = (content: string) => null | object;
export type ParsingFunction = (res: ParserActions, ...args: Array<string | object>) => boolean;
export type ParserActions = {

    /**
     * Current state.
     * Should only be used to access properties.
     */
    state: ParsingResult;

    /**
     * Updates the current raw-result. Only possible if not an object already.
     * Throws an error if the target is an object.
     * @param str
     */
    setString: (str: string) => void;

    /**
     * Defines / overrides a property of the result.
     * @param key
     * @param value
     */
    setProperty: (key: string, value: ParsingResultObjectValue) => void;
}

export type CompilerConfig = {
    functions: {
        [key: string]: ParsingFunction;
    };
}
