import Streamable       from '../../stream';
import {Token}          from '../../tokenizer/types';
import maybe            from '../tools/maybe';
import optional         from '../tools/optional';
import unicodeEscape    from '../tools/unicode-escape';
import {CharacterRange} from '../types';

const parsePoint = (stream: Streamable<Token>): number | null => {
    const str = optional(stream, 'str');

    if (str) {
        const val = str.value as string;
        return val.length === 1 ? val.charCodeAt(0) : null;
    }

    return unicodeEscape(stream);
};

module.exports = maybe<CharacterRange | null>(stream => {
    let from = parsePoint(stream);

    // The keyword 'to' indicates a character range
    if (from === null || !optional(stream, 'kw', 'to')) {
        return null;
    }

    let to = parsePoint(stream);
    if (to === null) {
        stream.throwError('Character-ranges consist of two single characters');
        return null;
    }

    if (to < from) {
        [to, from] = [from, to];
    }

    return {
        type: 'character-range',
        value: {
            from,
            to
        }
    } as CharacterRange;
});
