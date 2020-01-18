import {GroupValue}         from '../../ast/types';
import {ParserArgs}         from '../types';
import {evalDefineCommand}  from './commands/define';
import {evalPushCommand}    from './commands/push';
import {evalRemoveCommand}  from './commands/remove';
import {evalThrowStatement} from './commands/throw';
import {StatementOutcome}   from './statement-outcome';
import {
    evalCharacterSelection,
    evalCombiantor,
    evalConditionalStatement,
    evalFunction,
    evalGroup,
    evalLiteralContent,
    evalReference,
    evalSpread
} from '../internal';

export const evalDeclaration = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<GroupValue>
): StatementOutcome => {
    let outcome: StatementOutcome = StatementOutcome.OK;

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
        case 'ignored': // TODO: Rename ignored to void
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
                outcome = StatementOutcome.FAILED;
            }

            outcome = StatementOutcome.OK;
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
        case 'return': {
            outcome = StatementOutcome.RETURN;
        }
    }

    if (outcome === StatementOutcome.FAILED) {
        stream.pop();
    } else {
        stream.recycle();
    }

    return outcome;
};
