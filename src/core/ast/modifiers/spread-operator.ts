import maybe    from '../tools/maybe';
import optional from '../tools/optional';

/**
 * Parses a spread-operator
 * @type {Function}
 */
module.exports = maybe<true | null>(stream => {
    for (let i = 0; i < 3; i++) {
        if (!optional(stream, 'punc', '.')) {
            return null;
        }
    }

    return true;
});
