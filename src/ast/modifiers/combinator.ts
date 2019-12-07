import {maybe}    from '../tools/maybe';
import {optional} from '../tools/optional';

module.exports = maybe<string>(stream => {
    const combinator = optional(stream, 'punc', '|', '&');

    if (!combinator) {
        return null;
    }

    // It may be a extended combinator
    if (combinator.value === '&' && optional(stream, 'punc', '&')) {
        combinator.value += '&';
    }

    return combinator.value as string;
});
