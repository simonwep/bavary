import {TokenStream}                                                      from '../../tokenizer/token-stream';
import {parseGroup, parseIdentifier, parseLiteral, parseMemberExpression} from '../internal';
import {combine}                                                          from '../tools/combine';
import {maybe}                              from '../tools/maybe';
import {FunctionCall, FunctionCallArgument} from '../types';

export const parseFunction = maybe<FunctionCall>((stream: TokenStream) => {

    stream.consumeSpace();
    const name = parseIdentifier(stream);
    if (!name || !stream.optional(false, 'punc', '(')) {
        return null;
    }

    const parse = combine<FunctionCallArgument | null>(
        parseMemberExpression,
        parseIdentifier,
        parseGroup,
        parseLiteral
    );

    // Parse arguments
    const args = [];
    while (!stream.match(false, 'punc', ')')) {
        stream.consumeSpace();
        if (args.length) {
            stream.expect(false, 'punc', ',');
        }

        stream.consumeSpace();
        const arg = parse(stream);
        if (!arg) {
            stream.throw('Expected an a group, tag or identifier.');
        }

        args.push(arg);
    }

    stream.expect(false, 'punc', ')');
    return {
        type: 'function-call',
        name: name.value,
        args
    } as FunctionCall;
});
