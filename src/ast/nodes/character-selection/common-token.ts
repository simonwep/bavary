import {maybe}                   from '../../tools/maybe';
import {optional}                from '../../tools/optional';
import {CharacterSelectionArray} from '../../types';
import {commonTokens}            from './common-tokens';

export const parseCommonToken = maybe<CharacterSelectionArray>(stream => {

    // The . character stands for anything
    if (optional(stream, false, 'punc', '.')) {
        return [[0, 65535]];
    } else if (!optional(stream, false, 'punc', '\\')) {
        return null;
    }

    const token = stream.next(true);
    if (!token) {
        // TODO: TS-Bug? throwError has as return-type never but a return is required?
        return stream.throwError('Expected token.');
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
