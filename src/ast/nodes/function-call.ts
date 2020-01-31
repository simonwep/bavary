import {TokenStream}                                                      from '../../tokenizer/token-stream';
import {parseGroup, parseIdentifier, parseLiteral, parseMemberExpression} from '../internal';
import {combine}                                                          from '../tools/combine';
import {maybe}                                                            from '../tools/maybe';
import {FunctionCall, FunctionCallArgument}                               from '../types';

export const parseFunction = maybe<FunctionCall>((stream: TokenStream) => {

    const name = stream.optional('kw');
    if (!name || !stream.optional('punc', '(')) {
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
    while (!stream.match('punc', ')')) {
        if (args.length) {
            stream.expect('punc', ',');
        }

        const arg = parse(stream);
        if (!arg) {
            stream.throw('Expected an a group, tag or identifier.');
        }

        args.push(arg);
    }

    stream.expect('punc', ')');
    return {
        type: 'function-call',
        name,
        args
    } as FunctionCall;
});
