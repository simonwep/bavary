import {Func}                      from '../../ast/types';
import {createCustomFunctionUtils} from '../tools/create-custom-function-utils';
import {ParserArgs}                from '../types';

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Func>
): boolean => {
    const parseRawReference = require('./resolve-reference');
    const parseGroup = require('./group');

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
                resolvedArgs.push(parseGroup({
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
                resolvedArgs.push(parseRawReference({
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
            createCustomFunctionUtils(result),
            ...resolvedArgs
        );
    } catch (e) {
        throw new Error(`Function "${decl.name}" throwed an error:\n${e.message}`);
    }
};
