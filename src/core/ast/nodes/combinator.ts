import {maybe}      from '../tools/maybe';
import {optional}   from '../tools/optional';
import {Combinator} from '../types';

module.exports = maybe<Combinator>(stream => {
    const combinator = optional(stream, 'punc', '|', '&');

    if (!combinator) {
        return null;
    }

    // It may be a extended combinator
    if (combinator.value === '&' && optional(stream, 'punc', '&')) {
        combinator.value += '&';
    }

    return {
        type: 'combinator',
        value: combinator.value
    } as Combinator;
});
