import {check}                                        from '../tools/check';
import {combine}                                      from '../tools/combine';
import {expect}                                       from '../tools/expect';
import {maybe}                                        from '../tools/maybe';
import {optional}                                     from '../tools/optional';
import {skipWhitespace}                               from '../tools/skip-whitespace';
import {Func, Group, Identifier, Reference, Str, Tag} from '../types';

module.exports = maybe<Func>(stream => {
    const parseIdentifier = require('./identifier');

    skipWhitespace(stream);
    const name = parseIdentifier(stream);
    if (!name || !optional(stream, false, 'punc', '(')) {
        return null;
    }

    const parse = combine<Tag | Group | Str | Reference | Identifier>(
        require('./identifier'),
        require('./tag'),
        require('./group'),
        require('./string'),
        require('./reference')
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
