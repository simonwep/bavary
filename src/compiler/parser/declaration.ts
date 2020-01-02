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
        case 'ignored':
        case 'group': {
            const group = decl.type === 'ignored' ? decl.value : decl;
            const res = evalGroup({
                config, stream, scope,
                decl: group,
                result: decl.type === 'ignored' ? {pure: false, obj: {}, str: ''} : result
            });

            /**
             * The declaration is considered to be false if the result is null
             * and either no multiplier (The group would be required) or the multipliers
             * is not "optional" which would be the only one where null counts as true.
             */
            if (!res && (!group.multiplier || group.multiplier.type !== 'optional')) {
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
