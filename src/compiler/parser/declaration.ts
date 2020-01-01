import {GroupValue}                                                                                                           from '../../ast/types';
import {evalCharacterSelection, evalCombiantor, evalConditionalStatement, evalFunction, evalGroup, evalReference, evalString} from '../internal';
import {ParserArgs}                                                                                                           from '../types';

export const evalDeclaration = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<GroupValue>
): boolean => {

    stream.stash();
    switch (decl.type) {
        case 'combinator': {

            if (!evalCombiantor({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'string': {

            if (!evalString({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'character-selection': {

            if (!evalCharacterSelection({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'reference': {

            if (!evalReference({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'ignored': {
            const {value} = decl;
            const res = evalGroup({
                config, stream, scope,
                decl: value,
                result: {pure: false, obj: {}, str: ''}
            });

            if (!res) {

                // Check if group need to be matched
                if (value.multiplier && value.multiplier.type !== 'one-infinity') {
                    break;
                }

                stream.pop();
                return false;
            }

            break;
        }
        case 'group': {
            const res = evalGroup({config, stream, scope, decl, result});

            if (!res) {

                // Check if group need to be matched
                if (decl.multiplier && decl.multiplier.type !== 'one-infinity') {
                    break;
                }

                stream.pop();
                return false;
            }

            break;
        }
        case 'function': {

            if (!evalFunction({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'conditional-statement': {

            if (!evalConditionalStatement({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
    }

    stream.recycle();
    return true;
};
