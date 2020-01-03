import {TokenStream}             from '../../../tokenizer/stream/token-stream';
import {maybe}                   from '../../tools/maybe';
import {optional}                from '../../tools/optional';
import {CharacterSelectionArray} from '../../types';
import {commonTokens}            from './common-tokens';

export const parseCommonToken = maybe<CharacterSelectionArray>((stream: TokenStream) => {

    // The . character stands for anything
    if (optional(stream, false, 'punc', '.')) {
        return [[0, 65535]];
    } else if (!optional(stream, false, 'punc', '\\')) {
        return null;
    }

    const token = stream.next(true);
    if (!token) {
        stream.throwError('Expected token.');
    } else if (token.type === 'ws') {
        stream.throwError(`Expected token but got "${token.value}".`);
    }

    const tv = token.value as string;
    const target = commonTokens[tv];

    if (target === undefined) {
        stream.throwError(`Unknown token: "${tv}"`);
    }

    return target;
});