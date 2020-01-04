import {TokenStream} from '../../../tokenizer/stream/token-stream';
import {isValidHex}  from '../../tools/is-valid-hex';
import {maybe}       from '../../tools/maybe';

export const parseHexCharacter = maybe<number>((stream: TokenStream) => {

    if (!stream.optional(false, 'punc', '\\')) {
        return null;
    }

    const next = stream.optional(false, 'kw');
    if (!next || !(next as string).startsWith('x')) {
        return null;
    }

    const hex = (next as string).slice(1);
    if (hex.length !== 2 && hex.length !== 4) {
        stream.throwError('Hex value must either be 2 or 4 values.');
    } else if (!isValidHex(hex)) {
        stream.throwError('Invalid hex value.');
    }

    return parseInt(hex, 16);
});
