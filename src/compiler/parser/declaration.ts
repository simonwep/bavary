import {CharacterRange, Group, GroupedCombinator, Str, Type} from '../../ast/types';
import Streamable                                            from '../../stream';
import {ParsingResult, Scope}                                from '../types';

type ExtendetDeclarationValue = GroupedCombinator | Str | CharacterRange | Type | Group;
module.exports = (
    stream: Streamable<string>,
    decl: ExtendetDeclarationValue,
    scope: Scope,
    result: ParsingResult = {
        obj: {},
        str: '',
        pure: true
    }
): boolean => {
    const characterRange = require('./character-range');
    const combinator = require('./combinator');
    const string = require('./string');
    const group = require('./group');
    const type = require('./type');

    stream.stash();
    switch (decl.type) {
        case 'combinator': {

            if (!combinator(stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'string': {

            if (!string(stream, decl, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'character-range': {

            if (!characterRange(stream, decl, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'type': {

            if (!type(stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'group': {
            const res = group(stream, decl, scope, result);

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
    }

    stream.recycle();
    return true;
};
