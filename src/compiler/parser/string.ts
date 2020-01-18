import {Literal}          from '../../ast/types';
import {evalLiteral}      from '../tools/eval-literal';
import {ParserArgs}       from '../types';
import {StatementOutcome} from './statement-outcome';

export const evalLiteralContent = (
    {
        stream,
        decl,
        result
    }: ParserArgs<Literal>
): StatementOutcome => {
    const value = evalLiteral(result, decl);

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        // Check for type mismatch
        if (next !== value[i]) {
            stream.pop();
            return StatementOutcome.FAILED;
        }
    }

    stream.recycle();
    if (result.type === 'string') {
        result.value += value;
    }

    return StatementOutcome.OK;
};
