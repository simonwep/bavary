import {Streamable} from '../streamable';
import {Scope}      from './scope';


export type ParserArgs<DeclarationType> = {
    config: CompilerConfig;
    stream: Streamable<string>;
    decl: DeclarationType;
    scope: Scope;
    result: ParsingResult;
}

export type ParsingResultValue = string | ParsingResultObject | Array<ParsingResultObjectValue>;
export type ParsingResult = {type: 'string'; value: string} |
    {type: 'object'; value: ParsingResultObject} |
    {type: 'array'; value: Array<ParsingResultObjectValue>};

export type ParsingResultObjectValue = Array<ParsingResultObjectValue> | ParsingResultObject | string | number | null ;
export type ParsingResultObject = {
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
    state: ParsingResultValue;
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
