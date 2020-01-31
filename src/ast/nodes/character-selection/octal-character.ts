import {TokenStream}  from '../../../tokenizer/token-stream';
import {isValidOctal} from '../../tools/is-valid-octal';
import {maybe}        from '../../tools/maybe';

export const parseOctalCharacter = maybe<number>((stream: TokenStream) => {

    if (!stream.optional('punc', '\\')) {
        return null;
    }

    const next = stream.optional('num');
    if (!next) {
        return null;
    }

    const nextStr = String(next);
    if (!isValidOctal(nextStr) || next > 999) {
        stream.throw('Invalid octal value.');
    }

    // Parse and return decimal value
    return parseInt(nextStr, 8);
});
