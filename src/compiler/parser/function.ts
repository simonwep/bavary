import {Func}                                 from '../../ast/types';
import {evalGroup}                            from '../internal';
import {lookupValue}                          from '../tools/lookup-value';
import {ParserArgs, ParsingResultObjectValue} from '../types';

export const evalFunction = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Func>
): boolean => {

    // Resolve arguments
    const resolvedArgs = [];
    for (const arg of decl.args) {
        switch (arg.type) {
            case 'value-accessor': {
                resolvedArgs.push(lookupValue(result.value, arg.value) as ParsingResultObjectValue);
                break;
            }
            case 'group': {
                resolvedArgs.push(evalGroup({
                    config, stream, decl: arg, scope
                }));
                break;
            }
            case 'string':
            case 'identifier': {
                resolvedArgs.push(arg.value);
                break;
            }
        }
    }

    // Resolve function
    const fn = config.functions && config.functions[decl.name];
    if (typeof fn !== 'function') {
        throw new Error(`There is no such function: ${decl.name}`);
    }

    try {
        return fn(
            // Current state
            {state: result.value},

            // Resolved arguments
            ...resolvedArgs
        );
    } catch (e) {
        throw new Error(`Function "${decl.name}" throwed an error:\n${e.message}`);
    }
};
