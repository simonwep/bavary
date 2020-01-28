import {GroupValue}        from '../../ast/types';
import {
    evalCharacterSelection,
    evalCombiantor,
    evalConditionalStatement,
    evalFunction,
    evalGroup,
    evalLiteralContent,
    evalReference,
    evalSpread
}                          from '../internal';
import {ParserArgs}        from '../types';
import {evalDefineCommand} from './commands/define';
import {evalPushCommand}   from './commands/push';
import {evalRemoveCommand} from './commands/remove';
import {evalReturnCommand} from './commands/return';
import {evalThrowCommand}  from './commands/throw';

export const evalDeclaration = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<GroupValue>
): boolean => {
    let outcome = true;

    stream.stash();
    switch (decl.type) {
        case 'combinator': {
            outcome = evalCombiantor({config, stream, decl, scope, node});
            break;
        }
        case 'literal': {
            outcome = evalLiteralContent({config, stream, decl, scope, node});
            break;
        }
        case 'character-selection': {
            outcome = evalCharacterSelection({config, stream, decl, scope, node});
            break;
        }
        case 'reference': {
            outcome = evalReference({config, stream, decl, scope, node});
            break;
        }
        case 'ignored':
        case 'group': {
            const group = decl.type === 'ignored' ? decl.value : decl;
            const res = evalGroup({
                config, stream, scope,
                decl: group,
                node: decl.type === 'ignored' ? undefined : node
            });

            /**
             * The declaration is considered to be false if the node is null
             * and either no multiplier (The group would be required) or the multipliers
             * is not "optional" which would be the only one where null counts as true.
             */
            outcome = !!(res || (group.multiplier?.type === 'optional'));
            break;
        }
        case 'function-call': {
            outcome = evalFunction({config, stream, decl, scope, node});
            break;
        }
        case 'conditional-statement': {
            outcome = evalConditionalStatement({config, stream, decl, scope, node});
            break;
        }
        case 'spread': {
            outcome = evalSpread({config, stream, decl, scope, node});
            break;
        }
        case 'use':
        case 'define': {
            outcome = evalDefineCommand({config, stream, decl, scope, node});
            break;
        }
        case 'push': {
            outcome = evalPushCommand({config, stream, decl, scope, node});
            break;
        }
        case 'remove': {
            evalRemoveCommand({config, stream, decl, scope, node});
            break;
        }
        case 'return': {
            evalReturnCommand({config, stream, decl, scope, node});
            break;
        }
        case 'throw': {
            evalThrowCommand({config, stream, decl, scope, node});
        }
    }

    if (!outcome) {
        stream.pop();
        return false;
    }

    stream.recycle();
    return true;
};
