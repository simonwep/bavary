import expect   from '../tools/expect';
import maybe    from '../tools/maybe';
import optional from '../tools/optional';
import {Type}   from '../types';

module.exports = maybe<Type | null>(stream => {
    const identifier = require('./identifier');
    const multiplier = require('./multiplier');
    const string = require('./string');

    // It may be a type
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const ident = identifier(stream);
    if (!ident) {
        return stream.throwError('Expected identifier.');
    }

    let tag: string | null = null;
    if (optional(stream, 'punc', '#')) {
        const opt = string(stream) || identifier(stream);

        if (!opt) {
            return stream.throwError('Expected string or identifier as tag.');
        }

        tag = opt.value;
    }

    expect(stream, 'punc', '>');
    return {
        type: 'type',
        multiplier: multiplier(stream),
        value: ident.value,
        tag
    } as Type;
});
