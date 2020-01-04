import {TokenStream}             from '../../../tokenizer/stream/token-stream';
import {CharacterSelectionArray} from '../../types';
import {parseCommonToken}        from './common-token';
import {parseToken}              from './token';

export const parseSequence = (stream: TokenStream): CharacterSelectionArray => {
    const sequence: CharacterSelectionArray = [];

    do {
        const a = parseToken(stream);

        if (a === null) {

            // Check if a common-token sequence were used instead
            const ct = parseCommonToken(stream);

            if (ct) {
                sequence.push(...ct);
            } else {
                stream.throwError('Expected character-selection.');
            }

            continue;
        }

        // There may be a range seletion
        if (stream.optional(false, 'punc', '-')) {
            const b = parseToken(stream);

            if (b === null) {
                stream.throwError('Expected end position.');
            }

            sequence.push([
                Math.min(a, b),
                Math.max(a, b)
            ]);
        } else {
            sequence.push(a);
        }

    } while (stream.optional(false, 'punc', ','));

    return sequence;
};
