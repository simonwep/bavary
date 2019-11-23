import Streamable            from '../../../stream';
import {RawType}             from '../../../tokenizer/types';
import expect                from '../../tools/expect';
import maybe                 from '../../tools/maybe';
import optional              from '../../tools/optional';
import {Modifier, Modifiers} from '../../types';
import def                   from './def';
import del                   from './del';

const parsers: {
    [key: string]: (stream: Streamable<RawType>) => Modifier;
} = {def, del};

/**
 * Parses a lookup-sequence
 * @type {Function}
 */
module.exports = maybe<Modifiers | null>(stream => {
    if (!optional(stream, 'punc', '{')) {
        return null;
    }

    const set: Modifiers = [];

    // Parse key-value combies
    do {
        const op = optional(stream, 'kw', 'def', 'del');

        if (!op) {
            stream.throwError('Expected operator');
        } else {
            set.push(parsers[op.value](stream));
        }

        // Pairs are seperated via a comma
    } while (optional(stream, 'punc', ','));

    expect(stream, 'punc', '}');
    return set;
});
