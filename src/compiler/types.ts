import {Streamable} from '../streams/streamable';
import {Scope}      from './scope';

export type ParserArgs<DeclarationType> = {
    config: CompilerConfig;
    stream: Streamable<string>;
    decl: DeclarationType;
    scope: Scope;
    result: ParsingResult;
}

// Different kinds of parsing results
export type ParsingResultString = {type: 'string'; value: string};
export type ParsingResultObject = {type: 'object'; value: ParsingResultObjectKVSet};
export type ParsingResultArray = {type: 'array'; value: Array<ParsingResultValue>};
export type ParsingResult = ParsingResultString | ParsingResultObject | ParsingResultArray

export type ParsingResultValue = symbol | string | number | null |
    Array<ParsingResultValue> |
    ParsingResultObjectKVSet;

export type ParsingResultObjectKVSet = {
    [key: string]: ParsingResultValue;
}

export type Parser = (content: string) => null | ParsingResultValue;

export type NativeFunction = (
    res: NativeFunctionContainer,
    ...args: Array<Array<ParsingResultValue> | ParsingResultValue>
) => boolean;

export type NativeFunctionContainer = {

    /**
     * Current state.
     * Is either a array, string or object - depends on the context where it's used.
     */
    state: ParsingResult;
}

export type CompilerConfig = {
    locationData?: boolean | LocationDataObject;
    functions?: {
        [key: string]: NativeFunction;
    };
}

export type LocationDataObject = {
    start: string;
    end: string;
}
