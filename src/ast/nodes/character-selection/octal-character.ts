import {TokenStream}  from '../../../tokenizer/stream/token-stream';
import {isValidOctal} from '../../tools/is-valid-octal';
import {maybe}        from '../../tools/maybe';
import {optional}     from '../../tools/optional';

export const parseOctalCharacter = maybe<number>((stream: TokenStream) => {

    if (!optional(stream, false, 'punc', '\\')) {
        return null;
    }

    const next = optional(stream, false, 'num');
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
