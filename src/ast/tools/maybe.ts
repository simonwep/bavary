import Streamable from '../../stream';
import {Token}    from '../../tokenizer/types';

/**
 * Restores the previous location if the passed function returns null
 * @param fn
 * @returns {Function}
 */
export default <T>(fn: (stream: Streamable<Token>) => T | null) => (stream: Streamable<Token>): T | null => {
    stream.stash();

    const result = fn(stream);
    if (result !== null) {
        stream.recycle();
        return result;
    }

    stream.pop();
    return null;
};
