import {TokenStream}      from '../../tokenizer/token-stream';
import {combine}          from '../tools/combine';
import {maybe}            from '../tools/maybe';
import {MemberExpression} from '../types';

const parsePropertyExpression = maybe<string>((stream: TokenStream) => {
    if (!stream.optional('punc', '.')) {
        return null;
    }

    return stream.expect('kw');
});

const parseArrayExpression = maybe<number>((stream: TokenStream) => {
    if (!stream.optional('punc', '[')) {
        return null;
    }

    const index = stream.expect('num');
    stream.expect('punc', ']');

    return index;
});

export const parseMemberExpression = maybe<MemberExpression>((stream: TokenStream) => {

    // They start with a tag...
    if (!stream.optional('punc', '$')) {
        return null;
    }

    // Might start with a property
    const entry = stream.optional('kw');

    // Following path...
    const accessorPath = entry ? [entry] : [];
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
        type: 'member-expression',
        value: accessorPath
    } as MemberExpression;
});
