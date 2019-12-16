import {maybe}          from '../tools/maybe';
import {optional}       from '../tools/optional';
import {skipWhitespace} from '../tools/skip-whitespace';
import {Arguments}      from '../types';

module.exports = maybe<Arguments>(stream => {
    const parseIdentifier = require('./identifier');
    const parseGroup = require('./group');
    const args: Arguments = [];

    while (true) {
        skipWhitespace(stream);
        const name = parseIdentifier(stream);

        if (!name) {
            break;
        }

        // It may have a value
        let value = null;
        if (optional(stream, false, 'punc', '=')) {
            value = parseGroup(stream);

            if (!value) {
                stream.throwError('Expected a group.');
            }
        }

        args.push({
            type: 'argument',
            name: name.value,
            value
        });
    }

    return args.length ? args : null;
});
