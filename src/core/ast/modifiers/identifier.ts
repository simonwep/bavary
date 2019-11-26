import {RawType} from '../../tokenizer/types';
import maybe     from '../tools/maybe';

/**
 * Parses an identifier made out of keywords, numbers or hyphens
 * @type {Function}
 */
module.exports = maybe<string>(stream => {
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

    return name;
});
