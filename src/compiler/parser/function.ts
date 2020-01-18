import {NativeFunction}                 from '../../ast/types';
import {evalGroup}                      from '../internal';
import {evalLiteral}                    from '../tools/eval-literal';
import {evalMemberExpression}           from '../tools/eval-member-expression';
import {ParserArgs, ParsingResultValue} from '../types';

export const evalFunction = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<NativeFunction>
): boolean => {

    // Resolve arguments
    const resolvedArgs = [];
    for (const arg of decl.args) {
        switch (arg.type) {
            case 'value-accessor': {
                resolvedArgs.push(evalMemberExpression(result.value, arg.value) as ParsingResultValue);
                break;
            }
            case 'group': {
                resolvedArgs.push(evalGroup({
                    config, stream, decl: arg, scope
                }));
                break;
            }
            case 'literal': {
                resolvedArgs.push(evalLiteral(result, arg));
                break;
            }
            case 'identifier': {
                resolvedArgs.push(arg.value);
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
            {state: result},

            // Resolved arguments
            ...resolvedArgs
        );
    } catch (e) {
        throw new Error(`Function "${decl.name}" throwed an error:\n${e.message}`);
    }
};
