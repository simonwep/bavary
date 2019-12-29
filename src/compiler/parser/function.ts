import {Func}                        from '../../ast/types';
import {evalGroup, evalRawReference} from '../internal';
import {ParserArgs}                  from '../types';

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
                const val = result.obj[arg.value];

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
            case 'reference': {
                resolvedArgs.push(evalRawReference({
                    config, stream, scope,
                    result: {pure: false, obj: {}, str: ''},
                    decl: arg
                }));
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
            // Utils
            {
                state: result,

                setString(str): void {
                    if (!result.pure) {
                        throw new Error('Can\'t apply string, result isn\'t pure.');
                    }

                    result.str = str;
                },

                setProperty(key, val): void {
                    result.obj[key] = val;
                    result.pure = false;
                }
            },

            // Resolved arguments
            ...resolvedArgs
        );
    } catch (e) {
        throw new Error(`Function "${decl.name}" throwed an error:\n${e.message}`);
    }
};
