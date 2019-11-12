import maybe        from '../tools/maybe';
import {Identifier} from '../types';
import {RawType}    from '../../tokenizer/types';

/**
 * Parses an identifier made out of keywords, numbers or hyphens
 * @type {Function}
 */
module.exports = maybe<Identifier | null>(stream => {
    let name = '';

    while (stream.hasNext()) {
        const {type, value} = stream.peek() as RawType;

        if (type === 'kw' || type === 'num' || (type === 'punc' && (value === '-'))) {
            name += value;
            stream.next();
        } else {
            break;
        }
    }

    if (!name.length) {
        return null;
    }

    return {
        type: 'identifier',
        value: name
    } as Identifier;
});
