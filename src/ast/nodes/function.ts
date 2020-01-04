import {TokenStream}                                                        from '../../tokenizer/stream/token-stream';
import {parseGroup, parseIdentifier, parseReference, parseString, parseTag} from '../internal';
import {combine}                                                            from '../tools/combine';
import {maybe}                                                              from '../tools/maybe';
import {Func, FuncArgument}                                                 from '../types';

export const parseFunction = maybe<Func>((stream: TokenStream) => {

    stream.consumeSpace();
    const name = parseIdentifier(stream);
    if (!name || !stream.optional(false, 'punc', '(')) {
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
    while (!stream.match(false, 'punc', ')')) {
        stream.consumeSpace();
        if (args.length) {
            stream.expect(false, 'punc', ',');
        }

        stream.consumeSpace();
        const arg = parse(stream);
        if (!arg) {
            stream.throwError('Expected an a group, tag or identifier.');
        }

        args.push(arg);
    }

    stream.expect(false, 'punc', ')');
    return {
        type: 'function',
        name: name.value,
        args,
    } as Func;
});
