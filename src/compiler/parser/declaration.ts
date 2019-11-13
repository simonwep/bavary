import {CharacterRange, CharacterSelection, Group, GroupedCombinator, Reference, Str} from '../../ast/types';
import Streamable                                                                     from '../../stream';
import {ParsingResult, Scope}                                                         from '../types';

type ExtendetDeclarationValue = GroupedCombinator | Str | CharacterRange | CharacterSelection | Reference | Group;
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
    const characterSelection = require('./character-selection');
    const characterRange = require('./character-range');
    const combinator = require('./combinator');
    const reference = require('./reference');
    const string = require('./string');
    const group = require('./group');

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
        case 'character-selection': {

            if (!characterSelection(stream, decl, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'reference': {

            if (!reference(stream, decl, scope, result)) {
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
