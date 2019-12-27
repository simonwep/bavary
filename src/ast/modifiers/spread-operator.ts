import {maybe}    from '../tools/maybe';
import {optional} from '../tools/optional';

/**
 * Parses a spread-operator
 * @type {Function}
 */
export const spreadOperator = maybe<true | null>(stream => {
    for (let i = 0; i < 3; i++) {
        if (!optional(stream, false, 'punc', '.')) {
            return null;
        }
    }

    return true;
});
