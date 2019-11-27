import {combine}       from '../tools/combine';
import {expect}        from '../tools/expect';
import {maybe}         from '../tools/maybe';
import {optional}      from '../tools/optional';
import {ValueAccessor} from '../types';

const parseObjectAccessor = maybe<string>(stream => {
    if (!optional(stream, 'punc', '.')) {
        return null;
    }

    const ident = require('./identifier')(stream);
    if (!ident) {
        stream.throwError('Expected identifier.');
    }

    return ident;
});

const parseArrayAccessor = maybe<number>(stream => {
    if (!optional(stream, 'punc', '[')) {
        return null;
    }

    const index = expect(stream, 'num');
    expect(stream, 'punc', ']');

    return index.value as number;
});

module.exports = maybe<ValueAccessor>(stream => {
    const identifier = require('./identifier');
    const entry = identifier(stream);

    if (!entry) {
        return null;
    }

    const accessorPath = [entry];
    const parser = combine<string | number | null>(
        parseObjectAccessor,
        parseArrayAccessor
    );

    // Parse parts
    for (let val = null; (val = parser(stream)) !== null;) {
        accessorPath.push(val);
    }

    return {
        type: 'value-accessor',
        value: accessorPath
    } as ValueAccessor;
});
