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
export type ParsingResultArray = {type: 'array'; value: Array<ParsingResultObjectValue>};
export type ParsingResult = ParsingResultString | ParsingResultObject | ParsingResultArray

export type ParsingResultValue = string | ParsingResultObjectKVSet | Array<ParsingResultObjectValue>;
export type ParsingResultObjectValue = symbol | Array<ParsingResultObjectValue> | ParsingResultObjectKVSet | string | number | null;
export type ParsingResultObjectKVSet = {
    // TODO: See https://stackoverflow.com/questions/59118271/using-symbol-as-object-key-type-in-typescript
    [key: string]: ParsingResultObjectValue;
}

export type Parser = (content: string) => null | ParsingResultObjectValue;
export type CustomFunction = (res: CustomFunctionValues, ...args: Array<Array<ParsingResultObjectValue> | ParsingResultObjectValue>) => boolean;
export type CustomFunctionValues = {

    /**
     * Current state.
     * Is either a array, string or object - depends on the context where it's used.
     */
    state: ParsingResult;
}

export type CompilerConfig = {
    locationData?: boolean | LocationDataObject;
    functions?: {
        [key: string]: CustomFunction;
    };
}

export type LocationDataObject = {
    start: string;
    end: string;
}
