import {TokenStream}    from '../../misc/token-stream';
import {ParserFunction} from '../types';

/**
 * Restores the previous location if the passed function returns null
 * @param fn
 * @returns {Function}
 */
export const maybe = <T>(fn: ParserFunction<T>): ParserFunction<T> => {
    return (stream: TokenStream): T | null => {
        stream.stash();

        const result = fn(stream);
        if (result !== null) {
            stream.recycle();
            return result;
        }

        stream.pop();
        return null;
    };
};
