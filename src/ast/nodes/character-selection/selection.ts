import {TokenStream}             from '../../../misc/token-stream';
import {RawType}                 from '../../../tokenizer/types';
import {parseUnicodeEscape}      from '../../modifiers/unicode-escape';
import {optional}                from '../../tools/optional';
import {CharacterSelectionArray} from '../../types';

/**
 * Parses a single token, this may be a single
 * character "a" or an escaped character "\="
 */
const parseToken = (stream: TokenStream): number | null => {
    const unicode = parseUnicodeEscape(stream);

    if (unicode !== null) {
        return unicode;
    }

    // Check if there are any chars left before using .next()
    if (!stream.hasNext()) {
        return null;
    }

    const next = stream.peek() as RawType;
    const nextValue = String(next.value);
    const escaped = nextValue === '\\';

    // Validate length and check if it's a punctuation character which isn't escaped
    if (nextValue.length !== 1 || (next.type === 'punc' && !escaped)) {
        return null;
    }

    // Check if user wants to escape a punctuation character
    stream.next();
    if (escaped) {
        if (!stream.hasNext()) {
            return null;
        }

        const escaped = stream.peek() as RawType;
        const escapedValue = String(escaped.value);

        if (escaped.type !== 'punc') {
            stream.throwError('Only punctuation characters need to be escaped.');
        }

        stream.next();
        return escapedValue.charCodeAt(0);
    }

    return nextValue.charCodeAt(0);
};

/**
 * Parses a sequence of character tokens.
 * These may be (concatenates) ranges / and or characters "A - Z, a, b, c"
 */
export const parseSequence = (stream: TokenStream): CharacterSelectionArray => {
    const sequence: CharacterSelectionArray = [];

    while (true) {
        let a = null, b = null;
        a = parseToken(stream);

        if (a === null) {
            stream.throwError('Missing character (-sequence).');
        }

        // There may be a range seletion
        if (optional(stream, false, 'punc', '-')) {
            b = parseToken(stream);

            if (b === null) {
                stream.throwError('Expected end position.');
            }
        } else {
            b = null;
        }

        if (b !== null) {
            sequence.push([
                Math.min(a, b),
                Math.max(a, b)
            ]);
        } else {
            sequence.push(a);
        }

        // Character (sets) must be seperated by commas
        if (!optional(stream, false, 'punc', ',')) {
            break;
        }
    }

    return sequence;
};
