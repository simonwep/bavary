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
    let outcome = false;

    stream.stash();
    switch (decl.type) {
        case 'combinator': {
            outcome = evalCombiantor({config, stream, decl, scope, result});
            break;
        }
        case 'literal': {
            outcome = evalLiteralContent({config, stream, decl, scope, result});
            break;
        }
        case 'character-selection': {
            outcome = evalCharacterSelection({config, stream, decl, scope, result});
            break;
        }
        case 'reference': {
            outcome = evalReference({config, stream, decl, scope, result});
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
            outcome = !(!res && (!group.multiplier || group.multiplier.type !== 'optional'))
            break;
        }
        case 'function': {
            outcome = evalFunction({config, stream, decl, scope, result});
            break;
        }
        case 'conditional-statement': {
            outcome = evalConditionalStatement({config, stream, decl, scope, result});
            break;
        }
        case 'spread': {
            outcome = evalSpread({config, stream, decl, scope, result});
            break;
        }
        case 'define': {
            outcome = evalDefineCommand({config, stream, decl, scope, result});
            break;
        }
        case 'push': {
            outcome = evalPushCommand({config, stream, decl, scope, result});
            break;
        }
        case 'remove': {
            evalRemoveCommand({config, stream, decl, scope, result});
            break;
        }
        case 'throw': {
            evalThrowStatement({config, stream, decl, scope, result});
            break;
        }
    }

    if (!outcome) {
        stream.pop();
        return false;
    }

    stream.recycle();
    return true;
};
