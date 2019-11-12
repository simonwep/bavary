import {RawType} from '../../tokenizer/types';
import maybe     from './maybe';
import optional  from './optional';

/**
 * Parses a unicode escape and converts it into a decimal number
 */
export default maybe<number>(stream => {

    if (!optional(stream, 'punc', '\\') || !stream.hasNext()) {
        return null;
    }

    const sequence = String((stream.next() as RawType).value);
    if (!sequence.startsWith('u')) {
        return null;
    }

    // Validate length of sequence
    if (sequence.length !== 5) {
        stream.throwError('An unicode-escape sequence consists out of an "u" followed by a code-point.');
    }

    // Validate char-codes
    const hex = sequence.slice(1);
    for (const char of hex) {
        const code = char.charCodeAt(0);

        if (code < 48 || (code > 57 && code < 97) || code > 102) {
            stream.throwError('Invalid unicode-range.');
        }
    }

    return parseInt(hex, 16);
});
