import {Streamable} from '../misc/stream';
import {Scope}      from './scope';

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

export type ParsingResultObjectValue = Array<ParsingResultObjectValue> | ParsingResultObject | string | number | null ;
export type ParsingResultObject = {
    // TODO: See https://stackoverflow.com/questions/59118271/using-symbol-as-object-key-type-in-typescript
    [key: string]: ParsingResultObjectValue;
}

export type Parser = (content: string) => null | object;
export type ParsingFunction = (res: ParserActions, ...args: Array<Array<ParsingResultObjectValue> | ParsingResultObjectValue>) => boolean;
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
    locationData?: boolean | LocationDataObject;
    functions?: {
        [key: string]: ParsingFunction;
    };
}

export type LocationDataObject = {
    start: string;
    end: string;
}
