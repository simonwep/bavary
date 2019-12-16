import {GroupValue} from '../../ast/types';
import {ParserArgs} from '../types';

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<GroupValue>
): boolean => {
    const parseConditionalStatement = require('./conditional-statement');
    const parseCharacterSelection = require('./character-selection');
    const parseCombinator = require('./combinator');
    const parseReference = require('./reference');
    const parseFunction = require('./function');
    const parseString = require('./string');
    const parseGroup = require('./group');

    stream.stash();
    switch (decl.type) {
        case 'combinator': {

            if (!parseCombinator({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'string': {

            if (!parseString({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'character-selection': {

            if (!parseCharacterSelection({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'reference': {

            if (!parseReference({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'group': {
            const res = parseGroup({config, stream, decl, scope, result});

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

            if (!parseFunction({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'conditional-statement': {

            if (!parseConditionalStatement({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
    }

    stream.recycle();
    return true;
};
