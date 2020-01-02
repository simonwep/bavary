import {TokenStream}        from '../../../tokenizer/stream/token-stream';
import {Token}              from '../../../tokenizer/types';
import {parseUnicodeEscape} from '../../modifiers/unicode-escape';

export const parseToken = (stream: TokenStream): number | null => {
    const unicode = parseUnicodeEscape(stream);

    if (unicode !== null) {
        return unicode;
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

        const escaped = stream.peek() as Token;
        const escapedValue = String(escaped.value);

        if (escaped.type !== 'punc') {
            stream.throwError('Only punctuation characters need to be escaped.');
        }

        stream.next();
        return escapedValue.charCodeAt(0);
    }

    return nextValue.charCodeAt(0);
};
