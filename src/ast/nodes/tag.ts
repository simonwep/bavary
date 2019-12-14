import {maybe}    from '../tools/maybe';
import {optional} from '../tools/optional';
import {Tag}      from '../types';

module.exports = maybe<Tag | null>(stream => {
    if (!optional(stream, false, 'punc', '#')) {
        return null;
    }

    const ident = require('./identifier')(stream);
    if (!ident) {
        stream.throwError('Expected tag-identifier');
    }

    return {
        type: 'tag',
        value: ident.value
    };
});
