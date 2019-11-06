import expect        from '../tools/expect';
import maybe         from '../tools/maybe';
import optional      from '../tools/optional';
import {Declaration} from '../types';

module.exports = maybe<Declaration | null>(stream => {
    const group = require('./group');
    const block = require('./block');
    const type = require('./type');

    // Parse optional variant
    const variant = optional(stream, 'kw', 'entry', 'default', 'export');
    const target = type(stream);

    if (target) {
        expect(stream, 'punc', '=');

        // Declaration cannot have multipliers
        if (target.multiplier) {
            stream.throwError('Declaration type cannot contain multipliers.');
        }

        // Neither can they have tag
        if (target.tag) {
            stream.throwError('Declaration type cannot have a tag.');
        }

    } else if (!variant) {
        stream.throwError('Expected declaration.');
    }

    // A declaration value could be either a group or scoped block
    const body = group(stream) || block(stream);

    if (!body) {
        stream.throwError('A declaration consists of one group.');
    }

    return {
        type: 'declaration',
        name: target ? target.value : null,
        variant: variant ? variant.value : null,
        value: body
    } as Declaration;
});
