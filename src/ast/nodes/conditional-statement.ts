import {TokenStream}                                 from '../../tokenizer/stream/token-stream';
import {parseBinaryExpression, parseGroup}           from '../internal';
import {maybe}                                       from '../tools/maybe';
import {ConditionalStatement, Group, ParserFunction} from '../types';

export const parseConditionalStatement: ParserFunction<ConditionalStatement> = maybe((stream: TokenStream) => {
    if (!stream.optional(false, 'kw', 'if')) {
        return null;
    }

    // TODO: Add type-of to determine group type

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
    if (stream.optional(false, 'kw', 'else')) {
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
