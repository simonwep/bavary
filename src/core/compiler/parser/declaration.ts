import {GroupValue}                           from '../../ast/types';
import {Streamable}                           from '../../stream';
import {CompilerConfig, ParsingResult, Scope} from '../types';

module.exports = (
    config: CompilerConfig,
    stream: Streamable<string>,
    decl: GroupValue,
    scope: Scope,
    result: ParsingResult
): boolean => {
    const characterSelection = require('./character-selection');
    const combinator = require('./combinator');
    const reference = require('./reference');
    const string = require('./string');
    const group = require('./group');
    const fn = require('./function');

    stream.stash();
    switch (decl.type) {
        case 'combinator': {

            if (!combinator(config, stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'string': {

            if (!string(config, stream, decl, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'character-selection': {

            if (!characterSelection(config, stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'reference': {

            if (!reference(config, stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'group': {
            const res = group(config, stream, decl, scope, result);

            if (!res) {
                if (decl.multiplier) {
                    const {type} = decl.multiplier;

                    // Check if group need to be matched
                    if (type !== 'one-infinity') {
                        break;
                    }
                }

                stream.pop();
                return false;
            }

            break;
        }
        case 'function': {

            if (!fn(config, stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
    }

    stream.recycle();
    return true;
};
