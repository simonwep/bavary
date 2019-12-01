import {Streamable}                                  from '../../stream';
import {RawType}            from '../../tokenizer/types';
import {parseUnicodeEscape} from '../modifiers/unicode-escape';
import {expect}             from '../tools/expect';
import {maybe}                                       from '../tools/maybe';
import {optional}                                    from '../tools/optional';
import {CharacterSelection, CharacterSelectionArray} from '../types';

const parseToken = (stream: Streamable<RawType>): number | null => {
    const unicode = parseUnicodeEscape(stream);

    if (unicode !== null) {
        return unicode;
    }

    // Check if there are any chars left before using .next()
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
        const escapedValue = String(escaped.value);

        if (escaped.type !== 'punc') {
            stream.throwError('Only punctuation characters need to be escaped.');
        }

        stream.next();
        return escapedValue.charCodeAt(0);
    }

    return nextValue.charCodeAt(0);
};

const parseSequence = (stream: Streamable<RawType>): CharacterSelectionArray => {
    const sequence: CharacterSelectionArray = [];

    while (true) {
        let a = null, b = null;
        a = parseToken(stream);

        if (a === null) {
            stream.throwError('Missing character (-sequence).');
        }

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

        // Character (sets) must be seperated by commas
        if (!optional(stream, 'punc', ',')) {
            break;
        }
    }

    return sequence;
};

module.exports = maybe<CharacterSelection>(stream => {
    const multiplier = require('./multiplier');

    if (!optional(stream, 'punc', '(')) {
        return null;
    }

    const included: CharacterSelectionArray = [];
    const excluded: CharacterSelectionArray = [];
    included.push(...parseSequence(stream));

    if (optional(stream, 'kw', 'except')) {
        excluded.push(...parseSequence(stream));
    }

    expect(stream, 'punc', ')');
    return {
        type: 'character-selection',
        multiplier: multiplier(stream),
        included,
        excluded
    } as CharacterSelection;
});
