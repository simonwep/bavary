import {TokenStream}             from '../../../tokenizer/stream/token-stream';
import {optional}                from '../../tools/optional';
import {CharacterSelectionArray} from '../../types';
import {parseToken}              from './token';

export const parseSequence = (stream: TokenStream): CharacterSelectionArray => {
    const sequence: CharacterSelectionArray = [];

    while (true) {
        let a = null, b = null;
        a = parseToken(stream);

        if (a === null) {
            stream.throwError('Missing character (-sequence).');
        }

        // There may be a range seletion
        if (optional(stream, false, 'punc', '-')) {
            b = parseToken(stream);

            if (b === null) {
                stream.throwError('Expected end position.');
            }
        } else {
            b = null;
        }

        if (b !== null) {
            sequence.push([
                Math.min(a, b),
                Math.max(a, b)
            ]);
        } else {
            sequence.push(a);
        }

        // Character (sets) must be seperated by commas
        if (!optional(stream, false, 'punc', ',')) {
            break;
        }
    }

    return sequence;
};
