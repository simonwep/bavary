import expect   from '../tools/expect';
import maybe    from '../tools/maybe';
import optional from '../tools/optional';
import {Type}   from '../types';

module.exports = maybe<Type | null>(stream => {
    const identifier = require('../modifiers/identifier');

    // It may be a type
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const value = identifier(stream);
    if (!value) {
        stream.throwError('Expected identifier.');
    }

    expect(stream, 'punc', '>');
    return {
        type: 'type',
        value
    } as Type;
});
