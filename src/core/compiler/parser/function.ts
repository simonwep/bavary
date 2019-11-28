import {Func}                                 from '../../ast/types';
import {Streamable}                           from '../../stream';
import {CompilerConfig, ParsingResult, Scope} from '../types';

module.exports = (
    config: CompilerConfig,
    stream: Streamable<string>,
    decl: Func,
    scope: Scope,
    result: ParsingResult
): boolean => {
    const group = require('./group');

    // Resolve arguments
    const resolvedArgs = [];
    for (const arg of decl.args) {
        switch (arg.type) {
            case 'tag': {
                const val = result.obj[arg.value];
                resolvedArgs.push(typeof val === 'undefined' ? null : val);
                break;
            }
            case 'group': {
                resolvedArgs.push(group(config, stream, arg, scope));
                break;
            }
            case 'string': {
                resolvedArgs.push(arg.value);
                break;
            }
        }
    }

    // Resolve function
    const fnPair = config.functions.find(v => v[0] === decl.name);
    if (!fnPair) {
        throw new Error(`There is no such function: ${decl.name}`);
    }

    // Call
    return fnPair[1](
        result,
        ...resolvedArgs
    );
};
