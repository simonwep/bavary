import maybe        from '../tools/maybe';
import {Identifier} from '../types';

/**
 * Parses an identifier made out of keywords, numbers or hyphens
 * @type {Function}
 */
module.exports = maybe<Identifier | null>(stream => {
    let name = '';

    while (stream.hasNext()) {
        const {type, value} = stream.peek();

        if (type === 'kw' || type === 'num' || (type === 'punc' && (value === '-' || value === ':'))) {
            name += value;
            stream.next();
        } else {
            break;
        }
    }

    if (!name.length) {
        stream.throwError('An identifier cannot be empty.');
    }

    return {
        type: 'identifier',
        value: name
    } as Identifier;
});