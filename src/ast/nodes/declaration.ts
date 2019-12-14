import {expect}      from '../tools/expect';
import {maybe}       from '../tools/maybe';
import {optional}    from '../tools/optional';
import {Declaration} from '../types';

module.exports = maybe<Declaration>(stream => {
    const identifier = require('./identifier');
    const parseArguments = require('./arguments');
    const group = require('./group');
    const block = require('./block');

    // Parse optional variant
    const variant = optional(stream, false, 'kw', 'entry', 'default', 'export');
    let name = null, args = null;

    // It may be a named one
    if (optional(stream, false, 'punc', '<')) {

        name = identifier(stream);
        if (!name) {
            stream.throwError('Expected identifier.');
        }

        // Parse arguments
        args = parseArguments(stream);
        expect(stream, false, 'punc', '>');
        expect(stream, false, 'punc', '=');
    } else if (!variant) {
        stream.throwError('Expected declaration.');
    }

    // A declaration value could be either a group or scoped block
    let body;
    if (args?.length) {
        body = group(stream);

        if (!body) {
            stream.throwError('Expected a group.');
        }
    } else {
        body = group(stream) || block(stream);

        if (!body) {
            stream.throwError('Expected a group or block-statement.');
        }
    }

    return {
        type: 'declaration',
        name: name?.value || null,
        variant: variant?.value || null,
        value: body,
        arguments: args
    } as Declaration;
});
