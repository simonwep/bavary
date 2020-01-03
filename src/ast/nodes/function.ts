import {TokenStream}                                                        from '../../tokenizer/stream/token-stream';
import {parseGroup, parseIdentifier, parseReference, parseString, parseTag} from '../internal';
import {check}                                                              from '../tools/check';
import {combine}                                                            from '../tools/combine';
import {expect}                                                             from '../tools/expect';
import {maybe}                                                              from '../tools/maybe';
import {optional}                                                           from '../tools/optional';
import {skipWhitespace}                                                     from '../tools/skip-whitespace';
import {Func, FuncArgument}                                                 from '../types';

export const parseFunction = maybe<Func>((stream: TokenStream) => {

    skipWhitespace(stream);
    const name = parseIdentifier(stream);
    if (!name || !optional(stream, false, 'punc', '(')) {
        return null;
    }

    const parse = combine<FuncArgument | null>(
        parseIdentifier,
        parseTag,
        parseGroup,
        parseString,
        parseReference
    );

    // Parse arguments
    const args = [];
    while (!check(stream, false, 'punc', ')')) {
        skipWhitespace(stream);
        if (args.length) {
            expect(stream, false, 'punc', ',');
        }

        skipWhitespace(stream);
        const arg = parse(stream);
        if (!arg) {
            stream.throwError('Expected an a group, tag or identifier.');
        }

        args.push(arg);
    }

    expect(stream, false, 'punc', ')');
    return {
        type: 'function',
        name: name.value,
        args,
    } as Func;
});
