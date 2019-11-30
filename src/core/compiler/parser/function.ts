import {Func}                                     from '../../ast/types';
import {ParserActions, ParserArgs, ParsingResult} from '../types';

const createParserActionsObj = (res: ParsingResult): ParserActions => {
    return {
        state: res,

        setString(str): void {
            if (!res.pure) {
                throw new Error('Can\'t apply string, result isn\'t pure.');
            }

            res.str = str;
        },

        setProperty(key, val): void {
            res.obj[key] = val;
            res.pure = false;
        }
    };
};

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Func>
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
                resolvedArgs.push(group({
                    config, stream, decl: arg, scope
                }));
                break;
            }
            case 'string': {
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
            createParserActionsObj(result),
            ...resolvedArgs
        );
    } catch (e) {
        throw new Error(`Function "${decl.name}" throwed an error:\n${e.message}`);
    }
};
