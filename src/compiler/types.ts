import {Streamable} from '../streamable';
import {Scope}      from './scope';


export type ParserArgs<DeclarationType> = {
    config: CompilerConfig;
    stream: Streamable<string>;
    decl: DeclarationType;
    scope: Scope;
    result: ParsingResult;
}

export type ParsingResult = {type: 'string'; value: string} |
    {type: 'object'; value: ParsingResultObject} |
    {type: 'array'; value: Array<ParsingResultObjectValue>};

export type ParsingResultObjectValue = Array<ParsingResultObjectValue> | ParsingResultObject | string | number | null ;
export type ParsingResultObject = {
    // TODO: See https://stackoverflow.com/questions/59118271/using-symbol-as-object-key-type-in-typescript
    [key: string]: ParsingResultObjectValue;
}

export type Parser = (content: string) => null | ParsingResultObjectValue;
export type CustomFunction = (res: CustomFunctionUtils, ...args: Array<Array<ParsingResultObjectValue> | ParsingResultObjectValue>) => boolean;
export type CustomFunctionUtils = {

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
        [key: string]: CustomFunction;
    };
}

export type LocationDataObject = {
    start: string;
    end: string;
}
