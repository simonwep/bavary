import {parseBinaryExpression, parseGroup}           from '../internal';
import {maybe}                                       from '../tools/maybe';
import {optional}                                    from '../tools/optional';
import {ConditionalStatement, Group, ParserFunction} from '../types';

export const parseConditionalStatement: ParserFunction<ConditionalStatement> = maybe(stream => {
    if (!optional(stream, false, 'kw', 'if')) {
        return null;
    }

    // Parse condition
    const condition = parseBinaryExpression(stream);
    if (!condition) {
        stream.throwError('Expected a binary expression.');
    }

    // Parse then-block
    const then = parseGroup(stream);
    if (!then) {
        stream.throwError('Expected a group.');
    }

    // The else-branch is optional
    let alternative: Group | ConditionalStatement | null = null;
    if (optional(stream, false, 'kw', 'else')) {
        alternative = parseGroup(stream) || parseConditionalStatement(stream);

        if (!alternative) {
            stream.throwError('Expected a group.');
        }
    }

    return {
        type: 'conditional-statement',
        condition,
        consequent: then,
        alternate: alternative
    } as ConditionalStatement;
});
