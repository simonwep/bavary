import {TokenStream}  from '../../../tokenizer/stream/token-stream';
import {isValidOctal} from '../../tools/is-valid-octal';
import {maybe}        from '../../tools/maybe';

export const parseOctalCharacter = maybe<number>((stream: TokenStream) => {

    if (!stream.optional(false, 'punc', '\\')) {
        return null;
    }

    const next = stream.optional(false, 'num');
    if (!next) {
        return null;
    }

    const nextStr = String(next);
    if (!isValidOctal(nextStr) || next > 999) {
        stream.throwError('Invalid octal value.');
    }

    // Parse and return decimal value
    return parseInt(nextStr, 8);
});
