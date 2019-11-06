import Streamable from '../../stream';
import {Token}    from '../../tokenizer';

/**
 * Restores the previous location if the passed function returns null
 * @param fn
 * @returns {Function}
 */
export default <T>(fn: (...args) => T | null) => (stream: Streamable<Token>, ...args): T | null => {
    stream.stash();

    const result = fn(stream, ...args);
    if (result !== null) {
        stream.recycle();
        return result;
    }

    stream.pop();
    return null;
};
