import {NativeFunction}       from '../../ast/types';
import {evalGroup}            from '../internal';
import {NodeValue}            from '../node';
import {evalLiteral}          from '../tools/eval-literal';
import {evalMemberExpression} from '../tools/eval-member-expression';
import {ParserArgs}           from '../types';

export const evalFunction = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<NativeFunction>
): boolean => {

    // Resolve arguments
    const resolvedArgs = [];
    for (const arg of decl.args) {
        switch (arg.type) {
            case 'member-expression': {
                resolvedArgs.push(evalMemberExpression(node.value, arg.value) as NodeValue);
                break;
            }
            case 'group': {
                resolvedArgs.push(evalGroup({
                    config, stream, decl: arg, scope
                }));
                break;
            }
            case 'literal': {
                resolvedArgs.push(evalLiteral(node, arg));
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
            {state: node},

            // Resolved arguments
            ...resolvedArgs
        );
    } catch (e) {
        throw new Error(`Function "${decl.name}" throwed an error:\n${e.message}`);
    }
};
