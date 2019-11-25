import {Func}                 from '../../../ast/types';
import Streamable             from '../../../stream';
import {ParsingResult, Scope} from '../../types';

const availableFunctions = {
    count: require('./count')
} as {[key: string]: Function};

module.exports = (stream: Streamable<string>, decl: Func, scope: Scope, result: ParsingResult): boolean => {
    if (decl.name in availableFunctions) {
        return availableFunctions[decl.name](stream, decl, scope, result);
    }

    throw new Error(`Invalid function: "${decl.name}"`);
};
