import {check}                    from '../tools/check';
import {combine}                  from '../tools/combine';
import {expect}                   from '../tools/expect';
import {maybe}                    from '../tools/maybe';
import {optional}                      from '../tools/optional';
import {Func, Group, Reference, Tag} from '../types';

module.exports = maybe<Func>(stream => {
    const identifier = require('../modifiers/identifier');
    const name = identifier(stream);

    if (!name || !optional(stream, 'punc', '(')) {
        return null;
    }

    const parse = combine<Reference | Group | Tag>(
        require('./group'),
        require('./tag'),
        identifier
    );

    // Parse arguments
    const args = [];
    while (!check(stream, 'punc', ')')) {
        if (args.length) {
            expect(stream, 'punc', ',');
        }

        const arg = parse(stream);
        if (!arg) {
            stream.throwError('Expected an argument');
        }

        args.push(arg);
    }

    expect(stream, 'punc', ')');
    return {
        type: 'function',
        name,
        args,
    } as Func;
});
