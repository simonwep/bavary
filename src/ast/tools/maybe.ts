import {TokenStream} from '../../misc/token-stream';

/**
 * Restores the previous location if the passed function returns null
 * @param fn
 * @returns {Function}
 */
export const maybe = <T>(fn: (stream: TokenStream) => T | null) => (stream: TokenStream): T | null => {
    stream.stash();

    const result = fn(stream);
    if (result !== null) {
        stream.recycle();
        return result;
    }

    stream.pop();
    return null;
};
