import {Streamable}             from '../streams/streamable';
import {NodeValue, NodeVariant} from './node';
import {Scope}                  from './scope';

export type ParserArgs<DeclarationType> = {
    config: CompilerConfig;
    stream: Streamable<string>;
    decl: DeclarationType;
    scope: Scope;
    node: NodeVariant;
};

export type Parser = (content: string) => null | NodeValue;
export type NativeFunction = (
    res: NativeFunctionContainer,
    ...args: Array<Array<NodeValue> | NodeValue>
) => boolean;

export type NativeFunctionContainer = {

    /**
     * Current node.
     */
    node: NodeVariant;
};

export type CompilerConfig = {
    locationData?: boolean | LocationDataObject;
    functions?: {
        [key: string]: NativeFunction;
    };
};

export type LocationDataObject = {
    start: string;
    end: string;
};
