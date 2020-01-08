import {Func}       from '../../ast/types';
import {evalGroup}  from '../internal';
import {ParserArgs} from '../types';

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
            case 'tag': {

                if (result.type !== 'object') {
                    throw new Error('Tags can only be used within objects.');
                }

                const val = result.value[arg.value];
                if (val === undefined) {
                    throw new Error(`Tag "${val}" isn't defined anywhere but used in a function call.`);
                }

                resolvedArgs.push(val);
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
