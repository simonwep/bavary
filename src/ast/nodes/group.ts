import check            from '../tools/check';
import combine          from '../tools/combine';
import expect           from '../tools/expect';
import maybe            from '../tools/maybe';
import optional         from '../tools/optional';
import {ASTNode, Group} from '../types';

type GroupedCombinators = {
    type: 'combinator';
    sign: string;
    value: Array<ASTNode | GroupedCombinators>;
}

module.exports = maybe(stream => {
    const characterRange = require('./character-range');
    const combinator = require('./combinator');
    const multiplier = require('./multiplier');
    const string = require('./string');
    const group = require('./group');
    const type = require('./type');

    // It may be a group
    if (!optional(stream, 'punc', '[')) {
        return null;
    }

    const values: Array<ASTNode | GroupedCombinators> = [];
    const parsers = combine(
        type,
        group,
        characterRange,
        string,
    );

    let comg;
    while (!check(stream, 'punc', ']')) {
        const value = parsers(stream);
        const com = combinator(stream);

        if (!value) {
            return stream.throwError('Expected a type, group or raw string.');
        }

        if (com) {

            // Append to previous group
            if (comg) {
                if (com.value === comg.sign) {
                    comg.value.push(value);
                    continue;
                } else {
                    values.push(comg);
                    comg = null;
                }
            }

            comg = {
                type: 'combinator',
                sign: com.value,
                value: [value]
            } as GroupedCombinators;
        } else if (comg) {
            comg.value.push(value);
            values.push(comg);
            comg = null;
        } else {
            values.push(value);
        }
    }

    if (comg) {
        values.push(comg);
    }

    expect(stream, 'punc', ']');
    return {
        type: 'group',
        multiplier: multiplier(stream),
        value: values
    } as Group;
});
