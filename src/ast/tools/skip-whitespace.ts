import {TokenStream} from '../../tokenizer/stream/token-stream';

/**
 * Skips whitespace
 * @param stream
 */
export const skipWhitespace = (stream: TokenStream): void => {

    // Skip leading whitespace
    if (stream.peek(true)?.type === 'ws') {
        stream.next(true);
    }
};
