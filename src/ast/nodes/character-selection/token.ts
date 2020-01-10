import {TokenStream}         from '../../../tokenizer/stream/token-stream';
import {Token}               from '../../../tokenizer/types';
import {maybe}               from '../../tools/maybe';
import {parseHexCharacter}   from './hex-character';
import {parseOctalCharacter} from './octal-character';

export const parseToken = maybe<number>((stream: TokenStream) => {
    const characterCodePoint = parseHexCharacter(stream) || parseOctalCharacter(stream);

    if (characterCodePoint !== null) {
        return characterCodePoint;
    }

    // Check if there are any chars left before using .next()
    if (!stream.hasNext()) {
        return null;
    }

    const next = stream.peek() as Token;
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

        const escaped = stream.peek(true) as Token;
        const escapedValue = String(escaped.value);

        if (escaped.type !== 'punc') {

            // Must be a common-token
            return null;
        }

        stream.next();
        return escapedValue.charCodeAt(0);
    }

    return nextValue.charCodeAt(0);
});
