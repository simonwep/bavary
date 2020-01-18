import {TokenStream}      from '../../tokenizer/token-stream';
import {parseIdentifier}  from '../internal';
import {combine}          from '../tools/combine';
import {maybe}            from '../tools/maybe';
import {MemberExpression} from '../types';

const parsePropertyExpression = maybe<string>((stream: TokenStream) => {
    if (!stream.optional(true, 'punc', '.')) {
        return null;
    }

    const ident = parseIdentifier(stream);
    if (!ident) {
        stream.throw('Expected identifier.');
    }

    return ident.value;
});

const parseArrayExpression = maybe<number>((stream: TokenStream) => {
    if (!stream.optional(true, 'punc', '[')) {
        return null;
    }

    const index = stream.expect(true, 'num');
    stream.expect(true, 'punc', ']');

    return index as number;
});

export const parseMemberExpression = maybe<MemberExpression>((stream: TokenStream) => {

    // They start with a tag...
    if (!stream.optional(false, 'punc', '$')) {
        return null;
    }

    // Might start with a property
    const entry = parseIdentifier(stream);

    // Following path...
    const accessorPath = entry ? [entry.value] : [];
    const parser = combine<string | number | null>(
        parsePropertyExpression,
        parseArrayExpression
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
    } as MemberExpression;
});
