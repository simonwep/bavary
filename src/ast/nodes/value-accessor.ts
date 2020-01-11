import {TokenStream}     from '../../tokenizer/token-stream';
import {parseIdentifier} from '../internal';
import {combine}         from '../tools/combine';
import {maybe}           from '../tools/maybe';
import {ValueAccessor}   from '../types';

const parseObjectAccessor = maybe<string>((stream: TokenStream) => {
    if (!stream.optional(true, 'punc', '.')) {
        return null;
    }

    const ident = parseIdentifier(stream);
    if (!ident) {
        stream.throw('Expected identifier.');
    }

    return ident.value;
});

const parseArrayAccessor = maybe<number>((stream: TokenStream) => {
    if (!stream.optional(true, 'punc', '[')) {
        return null;
    }

    const index = stream.expect(false, 'num');
    stream.expect(true, 'punc', ']');

    return index as number;
});

export const parseValueAccessor = maybe<ValueAccessor>((stream: TokenStream) => {

    // They start with a tag...
    if (!stream.optional(false, 'punc', '$')) {
        return null;
    }

    // Might start with a property
    const entry = parseIdentifier(stream);

    // Following path...
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
        stream.throw('Expected value accessor.');
    }

    return {
        type: 'value-accessor',
        value: accessorPath
    } as ValueAccessor;
});
