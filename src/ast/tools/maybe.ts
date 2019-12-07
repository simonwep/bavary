import {Streamable} from '../../misc/stream';
import {RawType}    from '../../tokenizer/types';

/**
 * Restores the previous location if the passed function returns null
 * @param fn
 * @returns {Function}
 */
export const maybe = <T>(fn: (stream: Streamable<RawType>) => T | null) => (stream: Streamable<RawType>): T | null => {
    stream.stash();

    const result = fn(stream);
    if (result !== null) {
        stream.recycle();
        return result;
    }

    stream.pop();
    return null;
};
