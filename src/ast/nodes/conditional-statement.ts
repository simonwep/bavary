import {TokenStream}                                 from '../../tokenizer/stream/token-stream';
import {parseBinaryExpression, parseGroup}           from '../internal';
import {maybe}                                       from '../tools/maybe';
import {ConditionalStatement, Group, ParserFunction} from '../types';

export const parseConditionalStatement: ParserFunction<ConditionalStatement> = maybe((stream: TokenStream) => {

    // The if-keyword initiates a if-statement
    if (!stream.optional(false, 'kw', 'if')) {
        return null;
    }

    // Parse condition
    const condition = parseBinaryExpression(stream);
    if (!condition) {
        stream.throwError('Expected a binary expression.');
    }

    // Parse then-block
    const consequent = parseGroup(stream);
    if (!consequent) {
        stream.throwError('Expected a group.');
    }

    // The else-branch is optional
    let alternate: Group | ConditionalStatement | null = null;
    if (stream.optional(false, 'kw', 'else')) {
        alternate = parseGroup(stream) || parseConditionalStatement(stream);

        if (!alternate) {
            stream.throwError('Expected a group.');
        }
    }

    // Groups of if-statements can't have a associated type
    if (consequent.mode || (alternate?.type === 'group' && alternate.mode)) {
        stream.throwError('If-statement-blocks can\'t have a type attached to it.');
    }

    return {
        type: 'conditional-statement',
        condition, consequent, alternate
    } as ConditionalStatement;
});
