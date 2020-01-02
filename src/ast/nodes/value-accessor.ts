import {parseIdentifier} from '../internal';
import {combine}         from '../tools/combine';
import {expect}          from '../tools/expect';
import {maybe}           from '../tools/maybe';
import {optional}        from '../tools/optional';
import {ValueAccessor}   from '../types';

const parseObjectAccessor = maybe<string>(stream => {
    if (!optional(stream, true, 'punc', '.')) {
        return null;
    }

    const ident = parseIdentifier(stream);
    if (!ident) {
        stream.throwError('Expected identifier.');
    }

    return ident!.value;
});

const parseArrayAccessor = maybe<number>(stream => {
    if (!optional(stream, true, 'punc', '[')) {
        return null;
    }

    const index = expect(stream, false, 'num');
    expect(stream, true, 'punc', ']');

    return index as number;
});

export const parseValueAccessor = maybe<ValueAccessor>(stream => {
    const entry = parseIdentifier(stream);

    const accessorPath = entry ? [entry.value] : [];
    const parser = combine<string | number | null>(
        parseObjectAccessor,
        parseArrayAccessor
    );

    // Parse parts
    for (let val = null; (val = parser(stream)) !== null;) {
        accessorPath.push(val as string);
    }

    if (!accessorPath.length) {
        return null;
    }

    return {
        type: 'value-accessor',
        value: accessorPath
    } as ValueAccessor;
});
