import {TokenStream}             from '../../../tokenizer/token-stream';
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
                stream.throw('Expected character-selection.');
            }

            continue;
        }

        // There may be a range seletion
        if (stream.optional('punc', '-')) {
            const b = parseToken(stream);

            if (b === null) {
                stream.throw('Expected end position.');
            }

            sequence.push([
                Math.min(a, b),
                Math.max(a, b)
            ]);
        } else {
            sequence.push(a);
        }

    } while (stream.optional('punc', ','));

    return sequence;
};
