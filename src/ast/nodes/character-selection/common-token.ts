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
        stream.throwError('Expected token.');
    } else if (token.type === 'ws') {
        stream.throwError(`Expected token but got "${token.value}".`);
    }

    // TODO: TS thinks token could be null, see https://github.com/microsoft/TypeScript/issues/35964
    const tv = token!.value as string;
    const target = commonTokens[tv];

    if (target === undefined) {
        stream.throwError(`Unknown token: "${tv}"`);
    }

    return target;
});
