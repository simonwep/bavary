import Streamable                                    from '../../stream';
import {RawType}                                     from '../../tokenizer/types';
import expect                                        from '../tools/expect';
import maybe                                         from '../tools/maybe';
import optional                                      from '../tools/optional';
import unicodeEscape                                 from '../tools/unicode-escape';
import {CharacterSelection, CharacterSelectionArray} from '../types';

const parseToken = (stream: Streamable<RawType>): number | null => {
    const unicode = unicodeEscape(stream);

    if (unicode !== null) {
        return unicode;
    }

    // Check if there are any chars left before using .next()
    // TODO: Accept number in hasNext?
    if (!stream.hasNext()) {
        return null;
    }

    const next = stream.peek() as RawType;
    const nextValue = String(next.value);
    const escaped = nextValue === '\\';

    // Validate length and check if it's a punctuation character which isn't escaped
    if (nextValue.length !== 1 || (next.type === 'punc' && !escaped)) {
        return null;
    }

    // Check if user wants to escape a punctuation character
    stream.next();
    if (escaped) {
        if (!stream.hasNext()) {
            return null;
        }

        const escaped = stream.peek() as RawType;
        const escapedValue = String(next.value);


        if (escaped.type !== 'punc') {
            stream.throwError('Only punctuation characters need to be escaped.');
        } else if (escapedValue.length !== 1) {
            stream.throwError('Expected single character');
        }

        stream.next();
        return escapedValue.charCodeAt(0);
    }
    return nextValue.charCodeAt(0);

};

const parseSequence = (stream: Streamable<RawType>): CharacterSelectionArray => {
    const sequence: CharacterSelectionArray = [];
    let a, b = null;

    // TODO: Comma seperation is better
    while ((a = parseToken(stream)) !== null) {

        // There may be a range seletion
        if (optional(stream, 'punc', '-')) {
            b = parseToken(stream);

            if (b === null) {
                stream.throwError('Expected end position.');
            }
        } else {
            b = null;
        }

        if (b !== null) {
            sequence.push({
                type: 'range',
                from: Math.min(a, b),
                to: Math.max(a, b)
            });
        } else {
            sequence.push({
                type: 'character',
                value: a
            });
        }
    }

    return sequence;
};

module.exports = maybe<CharacterSelection | null>(stream => {
    if (!optional(stream, 'punc', '(')) {
        return null;
    }

    const included: CharacterSelectionArray = [];
    const excluded: CharacterSelectionArray = [];

    included.push(...parseSequence(stream));

    if (optional(stream, 'kw', 'except')) {
        excluded.push(...parseSequence(stream));

        if (!excluded.length) {
            stream.throwError('At least a single character must be excluded.');
        }
    }

    expect(stream, 'punc', ')');

    // TODO: Support multiplier
    return {
        type: 'character-selection',
        included,
        excluded
    } as CharacterSelection;
});
