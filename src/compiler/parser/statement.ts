import {GroupValue}         from '../../ast/types';
import {
    evalCharacterSelection,
    evalCombiantor,
    evalConditionalStatement,
    evalFunction,
    evalGroup,
    evalLiteralContent,
    evalReference,
    evalSpread
}                           from '../internal';
import {ParserArgs}         from '../types';
import {evalDefineCommand}  from './commands/define';
import {evalPushCommand}    from './commands/push';
import {evalRemoveCommand}  from './commands/remove';
import {evalThrowStatement} from './commands/throw';

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
        case 'literal': {

            if (!evalLiteralContent({config, stream, decl, scope, result})) {
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
                result: decl.type === 'ignored' ? undefined : result
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
        case 'spread': {

            if (!evalSpread({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'define': {

            if (!evalDefineCommand({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'push': {

            if (!evalPushCommand({config, stream, decl, scope, result})) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'remove': {
            evalRemoveCommand({config, stream, decl, scope, result});
            break;
        }
        case 'throw': {
            evalThrowStatement({config, stream, decl, scope, result});
        }
    }

    stream.recycle();
    return true;
};
